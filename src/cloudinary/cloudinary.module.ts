import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary.provider';
import { BullModule } from '@nestjs/bull';
import { UPLOAD } from '../utils/constants/cloudinary.constant';

@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  imports: [BullModule.registerQueue({ name: UPLOAD })],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
