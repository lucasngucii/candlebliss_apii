import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import { ImageEntity } from 'src/images/infrastructure/persistence/entity/image.entity';
import { ProductDetailEntity } from './detail.entity';
import { CategoryEntity } from '../../../../categories/infrastructure/persistence/entities/categories.entity';

@Entity({ name: 'product' })
export class ProductEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: String, nullable: false })
  name: string;

  @Column({ type: String, nullable: false })
  description: string;

  @Column({ type: String, nullable: false })
  video?: string;

  @OneToMany(() => ImageEntity, (image) => image.product_images, {
    eager: true,
  })
  images: ImageEntity[];

  @OneToMany(
    () => ProductDetailEntity,
    (productDetail) => productDetail.product,
  )
  details: ProductDetailEntity[];

  @OneToMany(() => CategoryEntity, (category) => category.product, {
    eager: true,
  })
  categories: CategoryEntity[];
}
