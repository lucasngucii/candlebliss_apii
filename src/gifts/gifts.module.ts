import { Module } from '@nestjs/common';
import { GiftsController } from './gifts.controller';
import { GiftsService } from './gifts.service';
import { InfrastructureRelationalGiftModule } from './infrastruture/persistence/persistence.module';

@Module({
  controllers: [GiftsController],
  providers: [GiftsService],
  imports: [InfrastructureRelationalGiftModule],
})
export class GiftsModule {}
