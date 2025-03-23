import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../utils/relational-entity-helper';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  ORDERED = 'Đã đặt hàng',
  PROCESSING = 'Đang xử lý',
  SHIPPING = 'Đang giao hàng',
  COMPLETED = 'Hoàn thành',
  CANCELLED = 'Đã huỷ',
  RETURNING = 'Đổi trả hàng',
  REFUNDING = 'Trả hàng/hoàn tiền',
}

@Entity('orders')
export class OrdersEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: Number })
  user_id: number;

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @Column({ type: String, nullable: true })
  address: string;

  @Column({ type: Number, nullable: true })
  total_quantity: number;

  @Column({ type: 'decimal', nullable: true })
  total_price: number;

  @Column({ type: 'decimal', nullable: true })
  discount: number;

  @Column({ type: 'decimal', nullable: true })
  ship_price: number;

  @Column({ type: String, nullable: true })
  method_payment: string;

  @OneToMany(() => OrderItem, (i) => i.order)
  item: OrderItem;
}
