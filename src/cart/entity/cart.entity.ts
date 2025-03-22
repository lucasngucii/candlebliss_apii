import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../utils/relational-entity-helper';
import { CartItemEntity } from './cart-item.entity';

@Entity('cart')
export class CartEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: Number })
  userId: number;

  @Column({ type: 'enum', enum: ['active', 'completed'], default: 'active' })
  status: string;

  @Column({ type: 'decimal', default: 0 })
  totalPrice: number;

  @Column({ type: 'int', default: 0 })
  totalQuantity: number;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart)
  cartItems?: CartItemEntity[];
}
