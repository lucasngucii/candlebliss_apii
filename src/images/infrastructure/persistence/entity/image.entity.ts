import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import { ProductEntity } from 'src/products/infrastucture/persistence/entities/product.entity';
import { ProductDetailEntity } from 'src/products/infrastucture/persistence/entities/detail.entity';
import { GiftEntity } from 'src/gifts/infrastruture/persistence/entities/gift.entity';

@Entity({ name: 'image' })
export class ImageEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: String, default: '' })
  path: string;

  @Column({ type: String, default: '' })
  public_id: string;

  @ManyToOne(() => ProductEntity)
  product_images: ProductEntity;

  @ManyToOne(() => ProductDetailEntity, (detail) => detail.images)
  product_details: ProductDetailEntity;

  @ManyToOne(() => GiftEntity, (gift) => gift.images)
  gift: GiftEntity;
}
