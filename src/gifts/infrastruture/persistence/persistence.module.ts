import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiftEntity } from './entities/gift.entity';
import { GiftsRepository } from '../gift.repository';
import { GiftsRelationalRepsository } from './repositories/gift';
import { ProductsModule } from 'src/products/products.module';
import { PriceModule } from 'src/price/price.module';
import { QueriesGiftService } from './queries/gift';
import { CommandGiftsService } from './commands/gift';
import { ImagesModule } from 'src/images/images.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GiftEntity]),
    ProductsModule,
    PriceModule,
    ImagesModule,
  ],
  providers: [
    {
      provide: GiftsRepository,
      useClass: GiftsRelationalRepsository,
    },
    QueriesGiftService,
    CommandGiftsService,
  ],
  exports: [GiftsRepository, QueriesGiftService, CommandGiftsService],
})
export class InfrastructureRelationalGiftModule {}
