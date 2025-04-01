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

  async create(createOrderDto: CreateOrdersDto) {
    const today = new Date().toISOString().split('T')[0];

    const key = `order:lock:user:${createOrderDto.user_id}:${today}`;

    const lockAcquired = await this.redis.set(key, 'lock', 10);

    if (!lockAcquired) {
      throw new BadRequestException(
        'Thao tác đang được xử lý, vui lòng thử lại sau',
      );
    }
    await this.entityManager.transaction(async (tran) => {
      let order = await this.findOrCreateOrder(createOrderDto, tran);

      const productDetailsInfo = await this.batchLoadProductDetails(
        createOrderDto.item,
        tran,
      );
      const orderItems = await this.processOrderItemsOptimized(
        createOrderDto.item,
        order.id,
        productDetailsInfo,
        tran,
      );

      const totalAmount = orderItems.reduce(
        (sum, item) => sum + Number(item.totalPrice),
        0,
      );

      order.total_price = totalAmount;
      order = await tran.save(OrderItem, order);

      await this.updateInventory(orderItems, productDetailsInfo, tran);

      await this.cacheOrderData(order.id, createOrderDto.user_id, orderItems);
      return order;
    });
  }

  async findOrCreateOrder(
    createOrderDto: CreateOrdersDto,
    transaction: EntityManager,
  ) {
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
  ): Promise<Map<number, any>> {
    const productDetailIds = items.map((item) => item.product_detail_id);

    const details = await transaction.query(
      `
      SELECT 
        pd.id,
        pd.size,
        pd.values,
        pd.quantities as available_quantity,
        p.base_price,
        p.discount_price
      FROM product_detail as pd
      JOIN prices p ON p."productDetailId" = pd.id
      WHERE 
        pd.id IN (${productDetailIds.map((_, idx) => `$${idx + 1}`).join(',')})
        AND pd."isActive" = true
        AND p.start_date <= CURRENT_TIMESTAMP
        AND p.end_date >= CURRENT_TIMESTAMP
      `,
      productDetailIds,
    );

    const detailsMap = new Map();
    for (const detail of details) {
      detailsMap.set(detail.id, detail);
    }

    return detailsMap;
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
    const currentProductDetailIds = new Set<number>();

    for (const itemDto of itemDtos) {
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
      // discount is percentage of discount price
      const price = pd.discount_price
        ? Number(pd.base_price) * (1 - Number(pd.discount_price) / 100)
        : Number(pd.base_price);
      const total_price = price * itemDto.quantity;

      const existingItem = existingItemMap.get(itemDto.product_detail_id);

      if (existingItem) {
        existingItem.quantity = itemDto.quantity;
        existingItem.totalPrice = total_price;
        itemsToUpdate.push(existingItem);
      } else {
        itemsToCreate.push({
          product_detail_id: Number(itemDto.product_detail_id),
          quantity: itemDto.quantity,
          totalPrice: total_price,
          status: OrderStatus.CREATED,
          order: { id: orderId } as OrdersEntity,
        } as OrderItem);
      }
    }
    const itemsToRemoveIds = existingItems
      .filter((item) => !currentProductDetailIds.has(item.product_detail_id))
      .map((item) => item.id);

    let result = [...itemsToUpdate];

    if (itemsToRemoveIds.length > 0) {
      await transactionManager.delete(OrderItem, { id: In(itemsToRemoveIds) });
    }
    if (itemsToCreate.length > 0) {
      const createdItems = await transactionManager.save(
        OrderItem,
        itemsToCreate,
      );
      result = [...result, ...createdItems];
    }

    if (itemsToUpdate.length > 0) {
      await transactionManager.save(OrderItem, itemsToUpdate);
    }

    return result;
  }

  private async updateInventory(
    orderItems: OrderItem[],
    pdMap: Map<number, any>,
    transaction: EntityManager,
  ) {
    const updatepromises = orderItems.map(async (item) => {
      const pd = pdMap.get(item.product_detail_id);
      const newQuantity = Math.max(
        0,
        pd.available_quantity - (item.quantity || 0),
      );
      return transaction.query(
        `
        UPDATE product_detail
        SET quantities = $1
        WHERE id = $2
        `,
        [newQuantity, item.product_detail_id],
      );
    });
    await Promise.all(updatepromises);
  }

  private async cacheOrderData(
    orderId: number,
    userId: number,
    items: OrderItem[],
  ) {
    const cacheKey = `order:${orderId}`;
    const userOrdersKey = `user:${userId}:orders`;
    await this.redis.setex(cacheKey, 3609, JSON.stringify(items));
    await this.redis.sadd(cacheKey, orderId.toString());
    await this.redis.expire(userOrdersKey, 3600);
  }

  public async findOrdersByUserId(
    user_id: number,
    page: number,
    limit: number,
  ): Promise<{ orders: OrdersEntity[]; total: number }> {
    const cacheKey = `user:${user_id}:orders:page:${page}:limit:${limit}`;

    const cachedData = await this.redis.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const [orders, total] = await this.orderRepository.findAndCount({
      where: { user_id: user_id },
      relations: ['items'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
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
}
