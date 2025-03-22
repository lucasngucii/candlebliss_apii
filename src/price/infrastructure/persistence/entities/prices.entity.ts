import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import { ProductDetailEntity } from 'src/products/infrastucture/persistence/entities/detail.entity';

@Entity('prices')
export class PricesEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', nullable: false })
  base_price: number;

  @Column({ type: 'decimal', nullable: false })
  discount_price: number;

  @Column({ type: Date, nullable: false })
  start_date: Date;

  @Column({ type: Date, nullable: false })
  end_date: Date;

  @OneToOne(() => ProductDetailEntity, { eager: true })
  @JoinColumn()
  product_detail?: ProductDetailEntity;
}
