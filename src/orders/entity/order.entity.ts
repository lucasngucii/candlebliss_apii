import { Column, Entity, OneToMany, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { EntityRelationalHelper } from '../../utils/relational-entity-helper';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  CREATED = 'Đơn hàng vừa được tạo',
  PAYMENT_PENDING = 'Đang chờ thanh toán',
  PAYMENT_FAILED = 'Thanh toán thất bại',
  PAYMENT_SUCCESS = 'Thanh toán thành công',
  PAYMENT_REFUND_PENDING = 'Đang chờ hoàn tiền',
  PAYMENT_REFUND_SUCCESS = 'Hoàn tiền thành công',
  PAYMENT_REFUND_FAILED = 'Hoàn tiền thất bại',
  PROCESSING = 'Đang xử lý',
  SHIPPING = 'Đang giao hàng',
  ORDERED = 'Đã đặt hàng',
  COMPLETED = 'Hoàn thành',
  CANCELLED = 'Đã huỷ',
  RETURNING = 'Đổi trả hàng',
}

@Entity('orders')
export class OrdersEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true, default: '' })
  order_code: string;

  @Column({ type: Number })
  user_id: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
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

  // voucher added
  @Column({ type: 'varchar', nullable: true, default: '' })
  voucher_id: number;

  @Column({ type: String, nullable: true })
  method_payment: string;

  @Column({ type: Number, nullable: true })
  rating: number;

  @OneToMany(() => OrderItem, (i) => i.order)
  item: OrderItem;

  @BeforeInsert()
  private generateOrderCode() {
    this.order_code = 'ORD-' + uuidv4().split('-')[0].toUpperCase();
  }
}
