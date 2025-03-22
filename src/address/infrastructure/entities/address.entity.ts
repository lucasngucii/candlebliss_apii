import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';

@Entity({ name: 'address' })
export class AddressEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, nullable: false })
  province: string;

  @Column({ type: String, nullable: false })
  district: string;

  @Column({ type: String, nullable: false })
  ward: string;

  @Column({ type: String, nullable: false })
  street: string;

  @ManyToOne(() => UserEntity, (user) => user.addresses)
  user: UserEntity;
}
