import { Module } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { VouchersController } from './vouchers.controller';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';

@Module({
  providers: [VouchersService],
  controllers: [VouchersController],
  imports: [PersistenceModule],
})
export class VouchersModule {}
