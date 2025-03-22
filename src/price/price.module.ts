import { Module } from '@nestjs/common';
import { PriceController } from './price.controller';
import { PriceService } from './price.service';
import { RelationalPricePersistenceModule } from './infrastructure/relational-persistence.module';

@Module({
  controllers: [PriceController],
  providers: [PriceService],
  imports: [RelationalPricePersistenceModule],
  exports: [PriceService],
})
export class PriceModule {}
