import { instanceToPlain } from 'class-transformer';
import {
  AfterLoad,
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class EntityRelationalHelper extends BaseEntity {
  __entity?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: Boolean, default: false })
  isDeleted: boolean;

  @AfterLoad()
  setEntityName() {
    this.__entity = this.constructor.name;
  }
  toJSON() {
    return instanceToPlain(this);
  }
}
