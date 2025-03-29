import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { CreateOrdersDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersEntity, OrderStatus } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(OrdersEntity)
    private readonly orderRepository: Repository<OrdersEntity>,
    @InjectRepository(OrderItem)
    private readonly itemRepository: Repository<OrderItem>,
  ) {}

  async create(createOrderDto: CreateOrdersDto) {
    // find user

    let address: string;
    if (createOrderDto.address) {
      address = createOrderDto.address;
    } else {
      const [foundAddress] = await this.entityManager.query(
        `
            SELECT a.* FROM address AS a
            WHERE a."userId" = $1
            LIMIT 1
          `,
        [createOrderDto.user_id],
      );

      if (!foundAddress) {
        throw new NotFoundException(
          'Không tìm thấy địa chỉ mặc định cho người dùng',
        );
      }

      address = `${foundAddress.street}, ${foundAddress.ward}, ${foundAddress.district}, ${foundAddress.province}`;
    }

    return this.orderRepository.save(
      this.orderRepository.create({
        user_id: createOrderDto.user_id,
        address: address ?? '',
        status: OrderStatus.CREATED,
      }),
    );
  }

  private async createItem(dto: CreateItemDto) {
    // check product detail
    const detail = await this.entityManager.query(
      `
          SELECT
            pd.id,
            pd.size,
            pd.type,
            pd.quantities as available_quantity,
            p.base_price,
            p.discount_price
          FROM
            product_detail as pd
          JOIN
            prices p ON p."productDetailId" = pd.id
          WHERE
              pd.id = $1
              AND pd."isActive" =true
              AND pd.quantities >= $2
              AND p.start_date <= CURRENT_TIMESTAMP
              AND p.end_date >= CURRENT_TIMESTAMP
          LIMIT 1
      `,
      [dto.product_detail_id, dto.quantity],
    );
    if (!detail || detail.length === 0) {
      throw new NotFoundException('Product not found or insufficient quantity');
    }
    const productDetail = detail[0];
    const totalPrice =
      Number(dto.quantity) *
      Number(
        productDetail.discount_price
          ? productDetail.discount_price
          : productDetail.base_price,
      );

    return this.itemRepository.save(
      this.itemRepository.create({
        product_detail_id: productDetail.id,
        quantity: dto.quantity,
        totalPrice: totalPrice,
        status: OrderStatus.CREATED,
      }),
    );
  }
}
