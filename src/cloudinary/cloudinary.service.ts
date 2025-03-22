import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, v2 } from 'cloudinary';
import { UPLOAD_IMG_FROM_PATH } from '../utils/constants/cloudinary.constant';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<{ secure_url: string; public_id: string }> {
    try {
      return await new Promise<{ secure_url: string; public_id: string }>(
        (resolve, reject) => {
          const uploadStream = v2.uploader.upload_stream(
            { folder: UPLOAD_IMG_FROM_PATH },
            (err, result) => {
              if (err) {
                return reject(err);
              }
              if (result) {
                resolve(result);
              } else {
                reject(new Error('Upload result is undefined'));
              }
            },
          );
          uploadStream.end(Buffer.from(file.buffer));
        },
      );
    } catch (error) {
      throw error as UploadApiErrorResponse;
    }
  }
  async uploadImages(
    files: Express.Multer.File[],
  ): Promise<{ secure_url: string; public_id: string }[]> {
    try {
      const uploadFile = (
        file: Express.Multer.File,
      ): Promise<{ secure_url: string; public_id: string }> => {
        return new Promise((resolve, reject) => {
          const uploadStream = v2.uploader.upload_stream(
            { folder: UPLOAD_IMG_FROM_PATH },
            (err, result) => {
              if (err) {
                return reject(err);
              }
              if (result) {
                resolve(result);
              } else {
                reject(new Error('Upload result is undefined'));
              }
            },
          );
          uploadStream.end(Buffer.from(file.buffer));
        });
      };

      const uploadPromises = files.map((file) => uploadFile(file));
      const result = await Promise.all(uploadPromises);

      return result.map((r) => ({
        secure_url: r.secure_url,
        public_id: r.public_id,
      }));
    } catch (error) {
      throw error as UploadApiErrorResponse;
    }
  }
}
