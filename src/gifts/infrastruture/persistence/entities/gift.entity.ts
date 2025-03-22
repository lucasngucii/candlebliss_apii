import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../utils/relational-entity-helper';
import { ImageEntity } from '../../../../images/infrastructure/persistence/entity/image.entity';
import { PricesEntity } from '../../../../price/infrastructure/persistence/entities/prices.entity';
import { ProductDetailEntity } from '../../../../products/infrastucture/persistence/entities/detail.entity';

@Entity('gift')
export class GiftEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', default: '' })
  name: string;

  @Column({ type: 'text', default: '' })
  description?: string;

  @Column({ type: 'varchar', default: '' })
  video?: string;

  @OneToMany(() => ImageEntity, (image) => image.gift)
  images?: ImageEntity[];

  @OneToOne(() => PricesEntity, { eager: true })
  @JoinColumn()
  prices?: PricesEntity;

  @ManyToMany(() => ProductDetailEntity, (productDetail) => productDetail.gift)
  @JoinTable()
  productDetails?: ProductDetailEntity[];
}
