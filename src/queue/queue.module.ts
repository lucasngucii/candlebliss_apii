import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get('queue.host', { infer: true }),
          port: config.get('queue.port', { infer: true }),
        },
        defaultJobOptions: {
          removeOnComplete: true,
          attempts: 3,
          backoff: { delay: 1000, type: 'exponential' },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
