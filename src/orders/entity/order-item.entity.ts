import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../utils/relational-entity-helper';
import { OrdersEntity } from './order.entity';

@Entity('order_item')
export class OrderItem extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String })
  status: string;

  @Column({ type: Number, nullable: true })
  product_detail_id: number;

  @Column({ type: Number })
  quantity?: number;

  @Column({ type: 'decimal' })
  totalPrice?: number;

  @ManyToOne(() => OrdersEntity, (o) => o.item)
  order: OrdersEntity;
}
