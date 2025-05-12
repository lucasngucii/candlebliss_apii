import { Module } from '@nestjs/common';
import { GiftService } from './gift.service';
import { GiftController } from './gift.controller';
import { ImagesModule } from '../images/images.module';

@Module({
  imports: [ImagesModule],
  providers: [GiftService],
  controllers: [GiftController]
})
export class GiftModule {}
