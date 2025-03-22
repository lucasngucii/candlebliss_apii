import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { RelationalAddressPersistenceModule } from './infrastructure/relational-persistence.module';
import { RelationalUserPersistenceModule } from '../users/infrastructure/persistence/relational/relational-persistence.module';

@Module({
  controllers: [AddressController],
  providers: [AddressService],
  imports: [
    RelationalAddressPersistenceModule,
    RelationalUserPersistenceModule,
  ],
})
export class AddressModule {}
