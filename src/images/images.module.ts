import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { RelationalImagePersistenceModule } from './infrastructure/relational-persistence.module';
import { BullModule } from '@nestjs/bull';
import { UPLOAD } from '../utils/constants/cloudinary.constant';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    RelationalImagePersistenceModule,
    BullModule.registerQueue({ name: UPLOAD }),
    CloudinaryModule,
  ],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
