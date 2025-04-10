import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager, In, Repository } from 'typeorm';
import { CreateOrdersDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersEntity, OrderStatus } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { RedisService } from '../redis/redis.service';
import { ProductDetailEntity } from '../products/infrastucture/persistence/entities/detail.entity';
import { VouchersEntity } from '../vouchers/infrastructure/persistence/entities/voucher.entity';
import {
  QueryOrdersByStatusDto,
  UpsertOrderByStatusDto,
  UpsertOrderPaymentMethodDto,
} from './dto/query.dto';
import { console } from 'inspector';
@Injectable()
export class OrdersService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(OrdersEntity)
    private readonly orderRepository: Repository<OrdersEntity>,
    @InjectRepository(OrderItem)
    private readonly itemRepository: Repository<OrderItem>,
    private redis: RedisService,
  ) {}

  async getOrdersByUserId(userId: number): Promise<OrdersEntity[]> {
    const orders = await this.orderRepository.find({
      where: { user_id: userId, isDeleted: false },
      relations: ['item'],
      order: { createdAt: 'DESC' },
    });
    if (!orders) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }
    return orders;
  }

  async findOrderById(id: number): Promise<OrdersEntity> {
    const order = await this.orderRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['item'],
      order: { item: { createdAt: 'DESC' } },
    });
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }
    return order;
  }

  async getOrderByUserIdAndStatus(
    query: QueryOrdersByStatusDto,
  ): Promise<OrdersEntity[]> {
    console.log(query);
    const orders = await this.orderRepository.query(
      `
      SELECT o.*, 
      SUM(oi.quantity) AS total_quantity,
      SUM(oi."totalPrice") AS total_price 
      FROM orders o
      LEFT JOIN order_item oi ON o.id = oi."orderId"
      WHERE o.user_id = $1
      AND o.status = $2
      AND o."isDeleted" = false
      AND oi."isDeleted" = false
      GROUP BY o.id
      `,
      [query.user_id, query.status],
    );
    if (!orders.length) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }
    return orders[0];
  }

  async upsert(createOrderDto: CreateOrdersDto) {
    const today = new Date().toISOString().split('T')[0];

    const key = `order:lock:user:${createOrderDto.user_id}:${today}`;

    const lockAcquired = await this.redis.set(key, 'lock', 10);

    if (!lockAcquired) {
      throw new BadRequestException(
        'Thao tác đang được xử lý, vui lòng thử lại sau',
      );
    }
    return await this.entityManager.transaction(async (tran) => {
      let order = await this.findOrCreateOrder(createOrderDto, tran);

      const loadProduct = await this.batchLoadProductDetails(
        createOrderDto.item,
        tran,
      );
      const orderItems = await this.processOrderItemsOptimized(
        createOrderDto.item,
        order.id,
        loadProduct.productDetailMap,
        tran,
      );

      const totalAmount = orderItems.reduce(
        (sum, item) => sum + Number(item.totalPrice),
        0,
      );
      const totalQuantity = orderItems.reduce(
        (sum, item) => sum + Number(item.quantity),
        0,
      );

      let voucher: VouchersEntity | null = null;
      if (createOrderDto.voucher_code) {
        voucher = await this.checkVoucher(
          createOrderDto.voucher_code,
          totalAmount,
          createOrderDto.user_id,
          loadProduct.productMap,
        );
      }
      // Apply voucher discount if applicable
      let discountAmount = 0;
      if (voucher) {
        if (voucher.percent_off && Number(voucher.percent_off) > 0) {
          discountAmount = (totalAmount * Number(voucher.percent_off)) / 100;

          if (
            voucher.max_voucher_amount &&
            discountAmount > Number(voucher.max_voucher_amount)
          ) {
            discountAmount = Number(voucher.max_voucher_amount);
          }
        } else if (voucher.amount_off && Number(voucher.amount_off) > 0) {
          discountAmount = Number(voucher.amount_off);
        }

        discountAmount = Math.min(discountAmount, totalAmount);
        order.total_price = totalAmount - discountAmount;
        order.voucher_id = voucher.id;
      } else {
        order.total_price = totalAmount;
      }
      order.total_quantity = totalQuantity;
      order.ship_price = 30000;
      order.discount = discountAmount;
      order.method_payment = '';
      order = await tran.save(OrdersEntity, order);

      await this.cacheOrderData(order.id, createOrderDto.user_id, orderItems);
      return await tran.findOne(OrdersEntity, {
        where: { id: order.id },
        relations: ['item'],
      });
    });
  }

  async findAndUpdateOrderStatusById(
    orderId: number,
    statusDto: UpsertOrderByStatusDto,
  ): Promise<OrdersEntity> {
    const query = `
      SELECT o.* FROM orders o
      WHERE o.id = $1
    `;
    const order = await this.orderRepository.query(query, [orderId]);
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }
    const orderEntity = order[0];
    this.validateStatusTransition(orderEntity.status, statusDto.status);
    orderEntity.status = statusDto.status;
    await this.invalidateOrderCache(orderId, orderEntity.user_id);
    return await this.orderRepository.save(orderEntity);
  }

  async findAndUpdateOrderMethodPaymentById(
    orderId: number,
    paymentDto: UpsertOrderPaymentMethodDto,
  ): Promise<OrdersEntity> {
    const query = `
      SELECT o.* FROM orders o
      WHERE o.id = $1
      AND o."isDeleted" = false
      `;
    const order = await this.orderRepository.query(query, [orderId]);
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }
    const orderEntity = order[0];
    orderEntity.method_payment = paymentDto.payment_method;
    await this.invalidateOrderCache(orderId, orderEntity.user_id);
    return await this.orderRepository.save(order);
  }

  public async findOrdersByUserId(
    user_id: number,
    offset: number,
    limit: number,
  ): Promise<{ orders: OrdersEntity[]; total: number }> {
    const cacheKey = `user:${user_id}:orders:page:${offset}:limit:${limit}`;

    const cachedData = await this.redis.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const [orders, total] = await this.orderRepository.findAndCount({
      where: { user_id: user_id },
      relations: ['items'],
      order: { createdAt: 'DESC' },
      skip: (offset - 1) * limit,
      take: limit,
    });

    const result = { orders, total };
    await this.redis.setex(cacheKey, 300, JSON.stringify(result)); // 5 phút
    return result;
  }

  public async updateOrderStatus(
    orderId: number,
    status: OrderStatus,
  ): Promise<OrdersEntity> {
    return this.entityManager.transaction(async (tran) => {
      const order = await tran
        .createQueryBuilder(OrdersEntity, 'order')
        .setLock('pessimistic_write')
        .where('order.id = :id', { id: orderId })
        .getOne();

      if (!order) {
        throw new NotFoundException('Không tìm thấy đơn hàng');
      }

      this.validateStatusTransition(order.status, status);
      order.status = status;
      await this.invalidateOrderCache(orderId, order.user_id);
      return await tran.save(order);
    });
  }

  async findOrCreateOrder(
    createOrderDto: CreateOrdersDto,
    transaction: EntityManager,
  ): Promise<OrdersEntity> {
    const today = new Date().toISOString().split('T')[0];
    const key = `order:user:${createOrderDto.user_id}:${today}:draft`;
    const cachedOrderId = await this.redis.get(key);

    if (cachedOrderId) {
      const [cachedOrder] = await transaction.query(
        `SELECT * FROM orders WHERE id = $1 AND status = $2`,
        [cachedOrderId, OrderStatus.CREATED],
      );
      if (cachedOrder) {
        return cachedOrder[0];
      }
    }

    const existingOrder = await transaction
      .createQueryBuilder(OrdersEntity, 'order')
      .setLock('pessimistic_write')
      .where('order.user_id = :user_id AND order.status = :status', {
        user_id: createOrderDto.user_id,
        status: OrderStatus.CREATED,
      })
      .getOne();

    if (existingOrder) {
      await this.redis.set(key, existingOrder.id.toString(), 60);
      return existingOrder;
    }

    let address: string;

    if (createOrderDto.address) {
      address = createOrderDto.address;
    } else {
      const [foundAddress] = await transaction.query(
        ` SELECT a.* FROM address AS a
          WHERE a."userId" = $1
          AND a."isDefault" = true
          LIMIT 1`,
        [createOrderDto.user_id],
      );
      if (!foundAddress) {
        throw new NotFoundException(
          'Không tìm thấy địa chỉ mặc định cho người dùng',
        );
      }
      address = `${foundAddress.street}, ${foundAddress.ward}, ${foundAddress.district}, ${foundAddress.province}`;
    }
    const newOrder = transaction.create(OrdersEntity, {
      user_id: createOrderDto.user_id,
      address,
      status: OrderStatus.CREATED,
      total_price: 0,
    });

    const savedOrder = await transaction.save(newOrder);

    await this.redis.set(key, savedOrder.id.toString(), 60);

    return savedOrder;
  }

  private async batchLoadProductDetails(
    items: CreateItemDto[],
    transaction: EntityManager,
  ): Promise<{
    productDetailMap: Map<number, any>;
    productMap: Map<number, any>;
  }> {
    const productDetailIds = items.map((item) => item.product_detail_id);
    const rows = await transaction.query(
      `
      SELECT 
        pd.id,
        pd.size,
        pd.values,
        pd.quantities as available_quantity,
        p.base_price,
        p.discount_price,
        pr.id as product_id
      FROM product_detail as pd
      JOIN product pr ON pr.id = pd."productId"
      JOIN prices p ON p."productDetailId" = pd.id
      WHERE 
        pd.id IN (${productDetailIds.map((_, idx) => `$${idx + 1}`).join(',')})
        AND pd."isActive" = true
        AND p.start_date <= CURRENT_TIMESTAMP
        AND p.end_date >= CURRENT_TIMESTAMP
        AND pr."isDeleted" = false
      `,
      productDetailIds,
    );

    const productDetailMap = new Map<number, any>();
    const productMap = new Map<number, any>();

    for (const row of rows) {
      productDetailMap.set(row.id, {
        size: row.size,
        values: row.values,
        available_quantity: row.available_quantity,
        base_price: row.base_price,
        discount_price: row.discount_price,
        product_id: row.product_id,
      });

      if (!productMap.has(row.product_id)) {
        productMap.set(row.product_id, {
          id: row.product_id,
        });
      }
    }

    return { productDetailMap, productMap };
  }

  async processOrderItemsOptimized(
    itemDtos: CreateItemDto[],
    orderId: number,
    productDetailsMap: Map<number, any>,
    transactionManager: EntityManager,
  ) {
    const existingItems = await transactionManager.find(OrderItem, {
      where: { order: { id: orderId } },
    });

    const existingItemMap = new Map();

    for (const item of existingItems) {
      existingItemMap.set(item.product_detail_id, item);
    }

    const itemsToCreate: OrderItem[] = [];
    const itemsToUpdate: OrderItem[] = [];
    const itemsToRemove: OrderItem[] = [];
    const inventoryUpdates: Array<{
      productDetailId: number;
      quantity: number;
    }> = [];
    const currentProductDetailIds = new Set<number>();

    for (const itemDto of itemDtos) {
      if (itemDto.quantity <= 0) {
        const existingItem = existingItemMap.get(itemDto.product_detail_id);
        if (existingItem) {
          itemsToRemove.push(existingItem);
          inventoryUpdates.push({
            productDetailId: itemDto.product_detail_id,
            quantity: existingItem.quantity, // Add back to inventory
          });
        }
        continue;
      }

      currentProductDetailIds.add(itemDto.product_detail_id);
      const pd = productDetailsMap.get(itemDto.product_detail_id);

      if (!pd) {
        throw new NotFoundException('Không tìm thấy chi tiết sản phẩm');
      }
      if (pd.available_quantity < itemDto.quantity) {
        throw new BadRequestException(
          `Số lượng ${itemDto.product_detail_id} sản phẩm không đủ`,
        );
      }

      const existingItem = existingItemMap.get(itemDto.product_detail_id);
      const currentQuantityInCart = existingItem ? existingItem.quantity : 0;

      const quantityChange = itemDto.quantity - currentQuantityInCart;

      if (quantityChange > 0 && pd.available_quantity < quantityChange) {
        throw new BadRequestException(
          `Số lượng sản phẩm (ID: ${itemDto.product_detail_id}) không đủ. Còn lại: ${pd.available_quantity}`,
        );
      }

      // discount is percentage of discount price
      const price = pd.discount_price
        ? Number(pd.base_price) * (1 - Number(pd.discount_price) / 100)
        : Number(pd.base_price);
      const total_price = price * itemDto.quantity;

      // Update inventory tracking
      if (quantityChange !== 0) {
        inventoryUpdates.push({
          productDetailId: itemDto.product_detail_id,
          quantity: -quantityChange, // Negative for reducing inventory
        });
      }

      if (existingItem) {
        existingItem.quantity = itemDto.quantity;
        existingItem.totalPrice = total_price;
        existingItem.unitPrice = price;
        itemsToUpdate.push(existingItem);
      } else {
        itemsToCreate.push({
          product_detail_id: Number(itemDto.product_detail_id),
          unit_price: price,
          quantity: itemDto.quantity,
          totalPrice: total_price,
          status: OrderStatus.CREATED,
          order: { id: orderId } as OrdersEntity,
        } as OrderItem);
      }
    }

    const additionalItemsToRemove = existingItems.filter(
      (item) => !currentProductDetailIds.has(item.product_detail_id),
    );

    for (const item of additionalItemsToRemove) {
      itemsToRemove.push(item);
      inventoryUpdates.push({
        productDetailId: item.product_detail_id,
        quantity: item.quantity,
      });
    }

    let result = [...itemsToUpdate];

    if (itemsToRemove.length > 0) {
      const idsToRemove = itemsToRemove.map((item) => item.id);
      await transactionManager.delete(OrderItem, { id: In(idsToRemove) });
    }
    // 1. Remove items
    if (itemsToCreate.length > 0) {
      const createdItems = await transactionManager.save(
        OrderItem,
        itemsToCreate,
      );
      result = [...result, ...createdItems];
    }
    // 2. Create new items

    if (itemsToCreate.length > 0) {
      const createdItems = await transactionManager.save(
        OrderItem,
        itemsToCreate,
      );
      result = [...result, ...createdItems];
    }
    // 3. Update existing items
    if (itemsToUpdate.length > 0) {
      await transactionManager.save(OrderItem, itemsToUpdate);
    }

    // 4. Update inventory
    for (const update of inventoryUpdates) {
      await transactionManager.increment(
        ProductDetailEntity,
        { id: update.productDetailId },
        'quantities',
        update.quantity,
      );
    }

    return result;
  }

  private async cacheOrderData(
    orderId: number,
    userId: number,
    items: OrderItem[],
  ) {
    const cacheKey = `order:${orderId}`;
    const userOrdersKey = `user:${userId}:orders`;

    await this.redis.setex(cacheKey, 3609, JSON.stringify(items));
    await this.redis.sadd(userOrdersKey, orderId.toString());
    await this.redis.expire(userOrdersKey, 3600);
  }

  private validateStatusTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus,
  ): void {
    const allowedTransitions = {
      [OrderStatus.CREATED]: [
        OrderStatus.PAYMENT_PENDING,
        OrderStatus.CANCELLED,
      ],
      [OrderStatus.PAYMENT_PENDING]: [
        OrderStatus.PAYMENT_SUCCESS,
        OrderStatus.PAYMENT_FAILED,
        OrderStatus.PROCESSING,
        OrderStatus.CANCELLED,
      ],
      [OrderStatus.PAYMENT_SUCCESS]: [
        OrderStatus.PROCESSING,
        OrderStatus.CANCELLED,
      ],
      [OrderStatus.PAYMENT_FAILED]: [
        OrderStatus.CREATED,
        OrderStatus.CANCELLED,
      ],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPING, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPING]: [OrderStatus.COMPLETED, OrderStatus.RETURNING],
      [OrderStatus.RETURNING]: [
        OrderStatus.COMPLETED,
        OrderStatus.PAYMENT_REFUND_PENDING,
      ],
      [OrderStatus.PAYMENT_REFUND_PENDING]: [
        OrderStatus.PAYMENT_REFUND_SUCCESS,
        OrderStatus.PAYMENT_REFUND_FAILED,
      ],
      [OrderStatus.PAYMENT_REFUND_SUCCESS]: [OrderStatus.COMPLETED],
      [OrderStatus.PAYMENT_REFUND_FAILED]: [OrderStatus.RETURNING],
      [OrderStatus.CANCELLED]: [],
      [OrderStatus.COMPLETED]: [],
    };

    if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(
        `Không thể chuyển trạng thái từ ${currentStatus} sang ${newStatus}`,
      );
    }
  }

  private async invalidateOrderCache(
    orderId: number,
    userId: number,
  ): Promise<void> {
    const keys = [
      `order:${orderId}`,
      `user:detail:${orderId}`,
      `user:${userId}:orders:*`,
    ];

    const pipeline = this.redis.pipeline();
    if (!pipeline) return;

    // Delete direct keys
    for (const key of keys) {
      if (!key.includes('*')) {
        pipeline.del(key);
      } else {
        // Handle pattern keys
        const scanStream = this.redis.scanStream(key, 100);

        await new Promise<void>((resolve) => {
          scanStream.on('data', (resultKeys) => {
            if (resultKeys.length > 0 && pipeline) {
              for (const resultKey of resultKeys) {
                pipeline.del(resultKey);
              }
            }
          });

          scanStream.on('end', () => {
            resolve();
          });
        });
      }
    }

    await pipeline.exec();
  }

  private async checkVoucher(
    voucher_code: string,
    total_price: number,
    user_id?: number,
    product_ids?: Map<number, any>,
  ): Promise<VouchersEntity> {
    const today = new Date();
    const entity = await this.entityManager.query(
      `
        SELECT v.* FROM vouchers v
        WHERE v.code = $1
          AND v."isActive" = true
          AND v."isDeleted" = false
      `,
      [voucher_code],
    );

    const voucher = entity[0];

    if (!voucher) {
      throw new NotFoundException('Không tìm thấy voucher');
    }

    if (voucher.start_date > today) {
      throw new BadRequestException('Voucher chưa bắt đầu');
    }

    if (voucher.end_date < today) {
      throw new BadRequestException('Voucher đã hết hạn');
    }

    if (voucher.usage_limit <= 0) {
      throw new BadRequestException('Voucher đã hết lượt sử dụng');
    }

    if (voucher.min_order_value > total_price) {
      throw new BadRequestException(
        'Đơn hàng không đủ điều kiện sử dụng voucher',
      );
    }
    if (voucher.usage_per_customer > 0 && user_id) {
      const usedCount = await this.entityManager.query(
        `
        SELECT COUNT(*) FROM orders
        WHERE voucher_id = $1
          AND user_id = $2
          AND "isDeleted" = false
      `,
        [voucher.id, user_id],
      );
      if (usedCount >= voucher.usage_per_customer) {
        throw new BadRequestException('Voucher đã hết lượt sử dụng');
      }
    }

    if (voucher.applicable_products && voucher.applicable_products.length > 0) {
      const productIds = voucher.applicable_products.map(
        (product: any) => product.id,
      );
      if (product_ids) {
        const isProductApplicable = productIds.some(
          (id: number) => id === product_ids.get(id),
        );
        if (!isProductApplicable) {
          throw new BadRequestException(
            'Voucher không áp dụng cho sản phẩm này',
          );
        }
      } else {
        throw new BadRequestException('Voucher không áp dụng cho sản phẩm này');
      }
    }
    // if (voucher.applicable_categories && voucher.applicable_categories.length > 0) {
    //   const categories = voucher.applicable_categories.map((category: any) => category.id);
    //   const isCategoryApplicable = categories.some((id: number) => id === categories);
    //   if (!isCategoryApplicable) {
    //     throw new BadRequestException('Voucher không áp dụng cho sản phẩm này');
    //   }
    // }

    if (voucher.new_customers_only && user_id) {
      const result = await this.entityManager.query(
        `
        SELECT EXISTS (
          SELECT 1 FROM orders
          WHERE user_id = $1
            AND "isDeleted" = false
        ) AS "exists"
      `,
        [user_id],
      );

      const isExistingCustomer = result[0].exists;

      if (isExistingCustomer) {
        throw new BadRequestException('Voucher chỉ áp dụng cho khách hàng mới');
      }
    }

    return voucher;
  }
}
