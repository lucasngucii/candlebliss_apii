import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { CreateOrdersDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersEntity, OrderStatus } from './entity/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(OrdersEntity)
    private orderRepository: Repository<OrdersEntity>,
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
        throw new Error('Không tìm thấy địa chỉ mặc định cho người dùng');
      }

      address = `${foundAddress.street}, ${foundAddress.ward}, ${foundAddress.district}, ${foundAddress.province}`;
    }

    return this.orderRepository.save(
      this.orderRepository.create({
        user_id: createOrderDto.user_id,
        address: address ?? '',
        status: OrderStatus.PROCESSING,
      }),
    );
  }
}
