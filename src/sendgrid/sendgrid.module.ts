import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SendGridController } from './sendgrid.controller';
import { SendGridService } from './sendgrid.service';
@Global()
@Module({
  imports: [ConfigModule],
  providers: [SendGridService],
  controllers: [SendGridController],
  exports: [SendGridService],
})
export class SendGridModule {}
