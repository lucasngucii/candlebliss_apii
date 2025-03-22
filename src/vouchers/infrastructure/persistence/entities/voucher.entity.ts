import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';

import { ProductEntity } from 'src/products/infrastucture/persistence/entities/product.entity';

@Entity('vouchers')
export class VouchersEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', unique: true })
  code: string;

  @Column({ type: String, default: '', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount_off?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  percent_off?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  min_order_value?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  max_voucher_amount?: number;

  @Column({ type: 'int' })
  usage_limit?: number;

  @Column({ type: 'int', nullable: true })
  usage_per_customer?: number;

  @CreateDateColumn()
  start_date: Date;

  @CreateDateColumn()
  end_date: Date;

  @ManyToMany(() => ProductEntity)
  @JoinTable()
  applicable_products?: ProductEntity[];

  @Column({ type: 'simple-array', nullable: true })
  applicable_categories?: string[];

  @Column({ type: 'boolean', default: false })
  new_customers_only?: boolean;

  @Column({ type: 'boolean', default: false })
  isActive?: boolean;
}
