import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from './entities/address.entity';
import { AddressRepository } from './address.repository';
import { AddressRelationalRepository } from './repository/address.repository';
import { UserEntity } from '../../users/infrastructure/persistence/relational/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity, UserEntity])],
  providers: [
    {
      provide: AddressRepository,
      useClass: AddressRelationalRepository,
    },
  ],
  exports: [AddressRepository],
})
export class RelationalAddressPersistenceModule {}
