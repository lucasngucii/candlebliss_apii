import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../utils/relational-entity-helper';
import { CartEntity } from './cart.entity';

@Entity('cart_item')
export class CartItemEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: Number, nullable: true })
  productDetailId: number;

  @Column({ type: Number })
  quantity?: number;

  @Column({ type: 'decimal' })
  totalPrice?: number;

  @ManyToOne(() => CartEntity, (cart) => cart.cartItems)
  cart: CartEntity;
}
