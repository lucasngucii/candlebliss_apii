import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import { ProductEntity } from 'src/products/infrastucture/persistence/entities/product.entity';

@Entity('history_prices')
export class HistoryPricesEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: Number, nullable: true })
  old_price: number;

  @Column({ type: Number, nullable: true })
  new_price: number;

  @Column({ type: Date, nullable: true })
  changed_at: Date;

  @Column({ type: String, nullable: true })
  changed_by: string;

  @ManyToOne(() => ProductEntity, { eager: true })
  product: ProductEntity;
}
