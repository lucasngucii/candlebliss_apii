import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VouchersEntity } from './entities/voucher.entity';
import { VoucherRepository } from '../voucher.repository';
import { VoucherRelationalRepository } from './repositories/voucher';
import { CommandVoucherService } from './command/voucher';

import { ProductsModule } from '../../../products/products.module';
import { QueryVoucherService } from './queries/voucher';

@Module({
  imports: [TypeOrmModule.forFeature([VouchersEntity]), ProductsModule],
  providers: [
    {
      provide: VoucherRepository,
      useClass: VoucherRelationalRepository,
    },
    CommandVoucherService,
    QueryVoucherService,
  ],
  exports: [VoucherRepository, CommandVoucherService, QueryVoucherService],
})
export class PersistenceModule {}
