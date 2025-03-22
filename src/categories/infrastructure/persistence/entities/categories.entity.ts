import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../utils/relational-entity-helper';
import { ProductEntity } from 'src/products/infrastucture/persistence/entities/product.entity';

@Entity({ name: 'categories' })
export class CategoryEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => ProductEntity, (product) => product.categories)
  product: ProductEntity;
}
