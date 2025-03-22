import { Process, Processor } from '@nestjs/bull';
import {
  UPLOAD,
  UPLOAD_IMAGE,
  UPLOAD_IMAGES,
} from '../utils/constants/cloudinary.constant';
import { CloudinaryService } from './cloudinary.service';
import { Job } from 'bull';

@Processor(UPLOAD)
export class CloudinaryConsumer {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Process(UPLOAD_IMAGE)
  async uploadImageQueue(job: Job<{ file: Express.Multer.File }>) {
    const { file } = job.data;
    console.log(`uploadImageQueue`, file);
    await this.cloudinaryService.uploadImage(file);
  }

  @Process(UPLOAD_IMAGES)
  async uploadImagesQueue(job: Job<{ files: Express.Multer.File[] }>) {
    const { files } = job.data;
    await this.cloudinaryService.uploadImages(files);
  }
}
