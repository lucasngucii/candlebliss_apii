import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import { ProductEntity } from './product.entity';
import { ImageEntity } from 'src/images/infrastructure/persistence/entity/image.entity';
import { GiftEntity } from '../../../../gifts/infrastruture/persistence/entities/gift.entity';

@Entity({ name: 'product_detail' })
export class ProductDetailEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, nullable: true })
  size?: string;

  @Column({ type: String, nullable: true })
  type?: string;

  @Column({ type: Boolean, default: false })
  isActive?: boolean;

  @Column({ type: Number, default: 0 })
  quantities?: number;

  @ManyToOne(() => ProductEntity, (product) => product.details)
  product?: ProductEntity;

  @OneToMany(() => ImageEntity, (image) => image.product_details, {
    eager: true,
  })
  images?: ImageEntity[];

  @ManyToMany(() => GiftEntity, (gift) => gift.productDetails, { eager: true })
  gift?: GiftEntity;
}
