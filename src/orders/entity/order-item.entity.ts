import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../utils/relational-entity-helper';
import { OrdersEntity } from './order.entity';

@Entity('order_item')
export class OrderItem extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String })
  status: string;

  @Column({ type: 'decimal', default: 0, nullable: true })
  unit_price: number;

  @Column({ type: Number, nullable: true })
  product_detail_id: number;

  @Column({ type: String, nullable: true })
  product_id: string;

  @Column({ type: Number, default: 0 })
  quantity: number;

  @Column({ type: 'decimal', nullable: true })
  totalPrice: number;

  @ManyToOne(() => OrdersEntity, (o) => o.item)
  order: OrdersEntity;
}
