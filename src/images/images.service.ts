import { Injectable, Logger } from '@nestjs/common';
import { ImageRepository } from './infrastructure/persistence/image.repository';

import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly uploadService: CloudinaryService,
  ) {}

  async uploadCloudImage(image: Express.Multer.File) {
    try {
      const updatedImage = await this.uploadService.uploadImage(image);

      return await this.imageRepository.create({
        path: updatedImage.secure_url,
        public_id: updatedImage.public_id,
      });
    } catch (error) {
      this.logger.error('Error uploading image to cloudinary:', error);
      throw error;
    }
  }

  async uploadCloudImages(images: Express.Multer.File[]) {
    try {
      const uploadedImages = await this.uploadService.uploadImages(images);
      return await Promise.all(
        uploadedImages.map(async (image) => {
          return this.imageRepository.create({
            path: image.secure_url,
            public_id: image.public_id,
          });
        }),
      );
    } catch (error) {
      this.logger.error('Error uploading images to cloudinary:', error);
      throw error;
    }
  }
}
