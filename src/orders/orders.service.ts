import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Between, EntityManager, In, Repository } from 'typeorm';
import { CreateOrdersDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersEntity, OrderStatus } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { RedisService } from '../redis/redis.service';
import { ProductDetailEntity } from '../products/infrastucture/persistence/entities/detail.entity';
import { VouchersEntity } from '../vouchers/infrastructure/persistence/entities/voucher.entity';
import {
  AddRatingDto,
  QueryCancelOrderDto,
  QueryOrdersByStatusAllDto,
  QueryOrdersByStatusDto,
  TimeFilterEnum,
  UpsertOrderByStatusDto,
  UpsertOrderPaymentMethodDto,
} from './dto/query.dto';

import { Image } from '../images/domain/image';
import { ImagesService } from '../images/images.service';
import { SendGridService } from '../sendgrid/sendgrid.service';
import { UserEntity } from '../users/infrastructure/persistence/relational/entities/user.entity';
import { NewOrderNotificationDto, OrderReceivedEmailDto } from '../sendgrid/dto';

interface InventoryUpdate {
  productDetailId: number;
  quantity: number;
}
@Injectable()
export class OrdersService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(OrdersEntity)
    private readonly orderRepository: Repository<OrdersEntity>,
    private redis: RedisService,
    private readonly imagesService: ImagesService,
    private sendGridService: SendGridService,
  ) { }
  async getAllOrders(): Promise<OrdersEntity[]> {
    const orders = await this.entityManager.find(OrdersEntity, {
      where: { isDeleted: false },
      relations: ['item'],
      order: { createdAt: 'DESC' },
    });
    if (!orders) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }
    return orders;
  }

  async getAllOrderByStatus(
    query: QueryOrdersByStatusAllDto,
  ): Promise<OrdersEntity[]> {
    const orders = await this.orderRepository.find({
      where: { status: query.status as OrderStatus, isDeleted: false },
      relations: ['item'],
      order: { createdAt: 'DESC' },
    });
    if (!orders) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }
    return orders;
  }
  async caculateOrdersDateToDate(startDate: Date, endDate: Date) {
    const entities = await this.getAlllOrderByDate(startDate, endDate);
    const filteredEntities = entities.filter(
      (order) => order.status === OrderStatus.COMPLETED,
    );
    const totalPriceAndShipped = filteredEntities.reduce((sum, order) => {
      return sum + Number(order.total_price);
    }, 0);

    const totalQuantity = filteredEntities.reduce((sum, order) => {
      return sum + Number(order.total_quantity);
    }, 0);

    const totalPriceShipped = filteredEntities.reduce((sum, order) => {
      return sum + Number(order.ship_price || 0);
    }, 0);

    return {
      totalRevenue: totalPriceAndShipped, // Tổng doanh thu (bao gồm phí vận chuyển)
      totalOrderValue: totalPriceAndShipped - totalPriceShipped, // Tổng giá trị đơn hàng (không bao gồm phí vận chuyển)
      totalShippingFee: totalPriceShipped, // Tổng phí vận chuyển
      totalOrders: filteredEntities.length, // Tổng số đơn hàng
      totalQuantity: totalQuantity, // Tổng số lượng sản phẩm
    };
  }
  /**
   * Lấy thống kê theo tháng
   */
  async getStatisticsByMonth(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    return this.caculateOrdersDateToDate(startDate, endDate);
  }
  /**
   * Lấy thống kê theo tuần
   * @param weekNumber Số tuần trong năm (1-52)
   */
  async getStatisticsByWeek(year: number, weekNumber: number) {
    // Tính ngày đầu tiên của tuần
    const firstDayOfYear = new Date(year, 0, 1);
    const daysOffset = (weekNumber - 1) * 7;

    // Tính ngày bắt đầu của tuần (thứ 2)
    const startDate = new Date(
      year,
      0,
      1 + daysOffset - firstDayOfYear.getDay() + 1,
    );

    // Tính ngày kết thúc của tuần (chủ nhật)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    return this.caculateOrdersDateToDate(startDate, endDate);
  }

  /**
   * Lấy thống kê theo năm
   */
  async getStatisticsByYear(year: number) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

    return this.caculateOrdersDateToDate(startDate, endDate);
  }

  async getStatisticsByDate(
    startDate: string,
    endDate: string,
  ): Promise<{
    totalRevenue: number;
    totalOrderValue: number;
    totalShippingFee: number;
    totalOrders: number;
    totalQuantity: number;
  }> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.caculateOrdersDateToDate(start, end);
  }


  /**
   * Hàm chung để lấy thống kê theo khoảng thời gian
   * @param timeFilter Loại bộ lọc: 'month', 'week', 'year'
   * @param timeValue Giá trị thời gian tương ứng
   * @param year Năm
   */
  async getStatistics(
    timeFilter: TimeFilterEnum,
    timeValue: number,
    year: number,
  ) {
    switch (timeFilter) {
      case TimeFilterEnum.MONTH:
        return this.getStatisticsByMonth(year, timeValue);
      case TimeFilterEnum.WEEK:
        return this.getStatisticsByWeek(year, timeValue);
      case TimeFilterEnum.YEAR:
        return this.getStatisticsByYear(timeValue);
      default:
        throw new Error('Loại bộ lọc thời gian không hợp lệ');
    }
  }
  async getAlllOrderByDate(
    startDate: Date,
    endDate: Date,
  ): Promise<OrdersEntity[]> {
    const orders = await this.orderRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
        isDeleted: false,
      },
      relations: ['item'],
      order: { createdAt: 'DESC' },
    });
    if (!orders) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }
    return orders;
  }


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
  async cancelOrReturnOrder(
    id: number,
    dto: QueryCancelOrderDto,
    imagesDto: Express.Multer.File[],
  ): Promise<OrdersEntity> {
    try {
      let images: Image[] = [];
      if (imagesDto.length) {
        images = await this.imagesService.uploadCloudImages(imagesDto);
      }

      return await this.entityManager.transaction(async (tran) => {
        const order = await tran.findOne(OrdersEntity, {
          where: { id: id, isDeleted: false },
          relations: ['item'],
        });
        if (!order) {
          throw new NotFoundException('Không tìm thấy đơn hàng');
        }

        order.status = dto.status;
        order.cancelReason = dto.reason || 'Người dùng đã hủy đơn hàng';
        order.updatedAt = new Date();
        order.cancel_images = images;
        // push quantity back to inventory
        const inventoryUpdates: InventoryUpdate[] = order.item.map((item) => ({
          productDetailId: item.product_detail_id,
          quantity: item.quantity,
        }));
        await this.updateInventory(inventoryUpdates, tran);
        await tran.save(OrdersEntity, order);
        await this.redis.del(`order:${order.id}:user:${order.user_id}`);
        const updatedOrder = await tran.findOne(OrdersEntity, {
          where: { id: order.id },
          relations: ['item'],
        });
        if (!updatedOrder) {
          throw new NotFoundException(
            'Không tìm thấy đơn hàng sau khi cập nhật',
          );
        }
        return updatedOrder;
      });
    } catch (error) {
      Logger.error('Error in cancelOrReturnOrder:', error);
      throw new BadRequestException('Có lỗi xảy ra khi hủy hoặc trả đơn hàng');
    }
  }
  async upsert(createOrderDto: CreateOrdersDto) {
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
        loadProduct.productMap,
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
      order.total_price = order.total_price + order.ship_price;
      order.method_payment = '';
      order = await tran.save(OrdersEntity, order);

      await this.cacheOrderData(order.id, createOrderDto.user_id, orderItems);
      const foundUser = await this.entityManager.findOne(UserEntity, {
        where: { id: createOrderDto.user_id },
      });
      if (foundUser?.email) {
        const listIdsProductDetail = createOrderDto.item.reduce((acc, item) => {
          if (item.product_detail_id) {
            acc.push(item.product_detail_id);
          }
          return acc;
        }, [] as number[]);
        const result = await this.entityManager.query(
          `
        SELECT 
          p.name, 
          i.path, 
          pd.size, 
          (pr.base_price - pr.base_price / 100 * pr.discount_price) AS final_price
        FROM product_detail pd
        JOIN product p ON pd."productId" = p.id
        JOIN image i ON pd.id = i."productDetailsId"
        JOIN prices pr ON pr."productDetailId" = pd.id
        WHERE pd.id =  ANY($1)
      `,
          [listIdsProductDetail],
        );
        const listProductDetails = result.map((item) => {
          return {
            product_image: item.path,
            product_name: item.name,
            product_variant: item.size,
            product_price: parseFloat(item.final_price),
          };
        });
        await this.sendGridService.sendEmailAdminNewOrderNotification({
          to: foundUser?.email,
          context: {
            order_code: order.id.toString(),
            order_detail_url: process.env.FRONTEND_DOMAIN + "/user/order/" + order.id,
            receiver_full_name:
              foundUser?.firstName + ' ' + foundUser?.lastName,
            receiver_phone: foundUser.phone
              ? foundUser.phone.toString()
              : 'Chưa có số điện thoại',
            receiver_address: order.address,
            products: listProductDetails,
            total_price: order.total_price.toString(),
            delivery_method: 'Nhà bán tự giao',
            shipping_fee: order.ship_price.toString(),
            total_amount: order.total_price.toString(),
          } as NewOrderNotificationDto,
        });
      }

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
    // this.validateStatusTransition(orderEntity.status, statusDto.status);
    orderEntity.status = statusDto.status;
    await this.invalidateOrderCache(orderId, orderEntity.user_id);
    return await this.orderRepository.save(orderEntity);
  }
  /*
    TODO: cần fix lại
  */
  async findAndUpdateOrderStatusCompletedById(
    orderId: number,
    ratingDto: AddRatingDto,
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
    orderEntity.status = OrderStatus.COMPLETED;
    orderEntity.rating = ratingDto.rating;
    const foundUser = await this.entityManager.findOne(UserEntity, {
      where: { id: orderEntity.user_id },
    })
    if (foundUser?.email) {
      const orderReceivedEmailDto: OrderReceivedEmailDto = {
        order_code: orderEntity.order_code,
        customer_name: foundUser.firstName + ' ' + foundUser.lastName,
        received_date: new Date().toISOString(),
        total_amount: orderEntity.total_price.toString(),
      };
      await this.sendGridService.sendEmailReceivedOrder({
        to: foundUser.email,
        context: orderReceivedEmailDto,
      });
    }
    const listProductIds = orderEntity.item.map(
      (item) => item.product_detail_id,
    );

    const listProductDetails = await this.entityManager.query(
      `
      SELECT * FROM product_detail
      WHERE id IN (${listProductIds.join(',')})
    `,
    );
    const listProductIdsMap = new Map<number, any>();
    listProductDetails.forEach((item) => {
      listProductIdsMap.set(item.id, item);
    });
    const listProductDetailIds = orderEntity.item.map(
      (item) => item.product_detail_id,
    );
    const listProductDetailIdsMap = new Map<number, any>();
    listProductDetailIds.forEach((item) => {
      listProductDetailIdsMap.set(item, item);
    });

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

      // this.validateStatusTransition(order.status, status);
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
    const productDetailIds = items
      .map((item) => Number(item.product_detail_id))
      .filter((id) => !isNaN(id));

    if (productDetailIds.length === 0) {
      return {
        productDetailMap: new Map(),
        productMap: new Map(),
      };
    }

    const placeholders = productDetailIds
      .map((_, idx) => `$${idx + 1}`)
      .join(',');
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
        pd.id IN (${placeholders})
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
      if (!row.id || !row.product_id) continue;

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

  /**
   * Cập nhật tồn kho cho nhiều sản phẩm
   * @param updates Danh sách các cập nhật tồn kho
   * @param transactionManager Entity manager để thực hiện giao dịch
   */
  private async updateInventory(
    updates: InventoryUpdate[],
    transactionManager: EntityManager,
  ): Promise<void> {
    for (const update of updates) {
      await transactionManager.increment(
        ProductDetailEntity,
        { id: update.productDetailId },
        'quantities',
        update.quantity,
      );
    }
  }
  /**
   * Xử lý danh sách các order items đã được tối ưu hóa
   * @param itemDtos Danh sách các item cần xử lý
   * @param orderId ID của đơn hàng
   * @param productDetailsMap Map chứa thông tin chi tiết sản phẩm
   * @param productMap Map chứa thông tin sản phẩm
   * @param transactionManager Entity manager để thực hiện giao dịch
   * @returns Danh sách các OrderItem đã được xử lý
   */
  async processOrderItemsOptimized(
    itemDtos: CreateItemDto[],
    orderId: number,
    productDetailsMap: Map<number, any>,
    productMap: Map<number, any>,
    transactionManager: EntityManager,
  ): Promise<OrderItem[]> {
    const existingItems = await transactionManager.find(OrderItem, {
      where: { order: { id: orderId } },
    });

    // Tạo map để truy cập nhanh vào các item hiện có
    const existingItemMap = new Map<number, OrderItem>();
    for (const item of existingItems) {
      existingItemMap.set(item.product_detail_id, item);
    }
    const itemsToCreate: OrderItem[] = [];
    const itemsToUpdate: OrderItem[] = [];
    const itemsToRemove: OrderItem[] = [];
    const inventoryUpdates: InventoryUpdate[] = [];
    const currentProductDetailIds = new Set<number>();

    for (const itemDto of itemDtos) {
      const productDetailId = Number(itemDto.product_detail_id);

      // Xử lý trường hợp số lượng <= 0 (xóa item)
      if (itemDto.quantity <= 0) {
        const existingItem = existingItemMap.get(productDetailId);
        if (existingItem) {
          itemsToRemove.push(existingItem);
          // Trả lại số lượng cho kho
          inventoryUpdates.push({
            productDetailId,
            quantity: existingItem.quantity,
          });
        }
        continue;
      }

      currentProductDetailIds.add(productDetailId);

      const pd = productDetailsMap.get(itemDto.product_detail_id);

      if (!pd) {
        throw new NotFoundException('Không tìm thấy chi tiết sản phẩm');
      }
      if (pd.available_quantity < itemDto.quantity) {
        throw new BadRequestException(
          `Số lượng ${itemDto.product_detail_id} sản phẩm không đủ`,
        );
      }

      const existingItem = existingItemMap.get(productDetailId);
      const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
      const quantityChange = itemDto.quantity - currentQuantityInCart;

      if (quantityChange > 0 && pd.available_quantity < quantityChange) {
        throw new BadRequestException(
          `Số lượng sản phẩm (ID: ${productDetailId}) không đủ. Còn lại: ${pd.available_quantity}`,
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
        existingItem.unit_price = price;
        itemsToUpdate.push(existingItem);
      } else {
        itemsToCreate.push({
          product_detail_id: Number(itemDto.product_detail_id),
          product_id: pd.product_id,
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
    await this.updateInventory(inventoryUpdates, transactionManager);

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
        OrderStatus.PROCESSING,
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
        OrderStatus.RETURN_ACCEPTED,
        OrderStatus.RETURN_REJECTED,
        OrderStatus.RETURN_ACCEPTED,
        OrderStatus.PROCESSING,
        OrderStatus.SHIPPING,
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

    if (Number(voucher.used) >= Number(voucher.usage_limit)) {
      throw new BadRequestException('Voucher đã hết lượt sử dụng');
    }

    if (voucher.min_order_value && Number(voucher.min_order_value) > total_price) {
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

    if (voucher.is_svip_only && user_id) {
      const query = `
      SELECT COUNT(*) AS count
      FROM orders
      WHERE user_id = $1
        AND "isDeleted" = false
        AND status = $2
      `
      const result = await this.entityManager.query(query, [
        user_id,
        OrderStatus.COMPLETED
      ]);
      const orderCount = result[0].count;
      if (Number(orderCount) < 20) {
        throw new BadRequestException('Voucher chỉ áp dụng cho khách hàng SVIP');
      }
    }
    await this.entityManager.query(
      `
        UPDATE vouchers
        SET usage_limit = usage_limit - 1
        WHERE id = $1
      `,
      [voucher.id],
    );
    return voucher;
  }
}
