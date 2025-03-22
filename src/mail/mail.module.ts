import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailerModule } from '../mailer/mailer.module';
import { BullModule } from '@nestjs/bull';
import { MAIL_QUEUE } from '../utils/constants/queue.constant';
import { MailSignUpConsumer } from './consumers/mail.consumer';

@Module({
  imports: [
    ConfigModule,
    MailerModule,
    BullModule.registerQueue({ name: MAIL_QUEUE }),
  ],
  providers: [MailService, MailSignUpConsumer],
  exports: [MailService],
})
export class MailModule {}
