import { registerAs } from '@nestjs/config';
import { IsString, ValidateIf } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { CloudinaryConfig } from './cloudinary-config.type';

class EnvironmentVariablesValidator {
  @ValidateIf((env) => env.CLOUDINARY_CLOUD_NAME)
  @IsString()
  CLOUDINARY_CLOUD_NAME: string;
  @ValidateIf((env) => env.CLOUDINARY_API_KEY)
  @IsString()
  CLOUDINARY_API_KEY: string;
  @ValidateIf((env) => env.CLOUDINARY_API_SECRET)
  @IsString()
  CLOUDINARY_API_SECRET: string;
}

export default registerAs<CloudinaryConfig>('cloudinary', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    api_key: process.env.CLOUDINARY_API_KEY ?? '',
    api_secret: process.env.CLOUDINARY_API_SECRET ?? '',
  };
});
