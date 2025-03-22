import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricesEntity } from './persistence/entities/prices.entity';
import { HistoryPricesEntity } from './persistence/entities/history_prices.entity';
import { HistoryPricesRepository } from './persistence/history-price.repository';
import { HistoryPricesRelationalRepository } from './persistence/repository/history_prices';
import { PricesRepository } from './persistence/price.repository';
import { PricesRelationalRepository } from './persistence/repository/prices';
import { CommandPriceService } from './persistence/command/price.command';
import { RelationalProductPersistenceModule } from '../../products/infrastucture/relational-persistence.module';
import { CommandHistoryPriceSerivce } from './persistence/command/history-price.command';
import { QueryPriceService } from './persistence/queries/price.query';
import { QueryHistoryPricesService } from './persistence/queries/price-history.query';

@Module({
  imports: [
    TypeOrmModule.forFeature([PricesEntity, HistoryPricesEntity]),
    RelationalProductPersistenceModule,
  ],
  providers: [
    {
      provide: HistoryPricesRepository,
      useClass: HistoryPricesRelationalRepository,
    },
    {
      provide: PricesRepository,
      useClass: PricesRelationalRepository,
    },
    CommandPriceService,
    CommandHistoryPriceSerivce,
    QueryPriceService,
    QueryHistoryPricesService,
  ],
  exports: [
    HistoryPricesRepository,
    PricesRepository,
    CommandPriceService,
    CommandHistoryPriceSerivce,
    QueryPriceService,
    QueryHistoryPricesService,
  ],
})
export class RelationalPricePersistenceModule {}
