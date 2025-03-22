import { IsNumber, IsString, ValidateIf } from 'class-validator';
import { QueueConfig } from './queue-config.type';
import validateConfig from '../../utils/validate-config';
import { registerAs } from '@nestjs/config';

class EnvironmentVariablesValidator {
  @ValidateIf((envValues) => envValues.QUEUE_HOST)
  @IsString()
  QUEUE_HOST: string;

  @ValidateIf((envValues) => envValues.QUEUE_PORT)
  @IsNumber()
  QUEUE_PORT: number;
}
export default registerAs<QueueConfig>('queue', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    host: process.env.QUEUE_HOST || 'localhost',
    port: process.env.QUEUE_PORT ? parseInt(process.env.QUEUE_PORT, 10) : 6379,
  };
});
