import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../utils/relational-entity-helper';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  CREATED = 'Đơn hàng vừa được tạo',
  PAYMENT_PENDING = 'Đang chờ thanh toán',
  PAYMENT_FAILED = 'Thanh toán thất bại',
  PAYMENT_SUCCESS = 'Thanh toán thành công',
  PROCESSING = 'Đang xử lý',
  SHIPPING = 'Đang giao hàng',
  ORDERED = 'Đã đặt hàng',
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

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
  status: string;

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
