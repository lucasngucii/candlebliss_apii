import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendGridFormDTO } from './dto';
@Injectable()
export class SendGridService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmailAdminNewOrderNotification(sendGridFormDTO: SendGridFormDTO) {
    await this.mailerService.sendMail({
      to: sendGridFormDTO.to,
      subject: 'Welcome to Candle Bliss',
      template: 'new-order-notification',
      context: sendGridFormDTO.context,
    });
  }

  //   async sendEmailUserNewOrderNotification(sendGridFormDTO: SendGridFormDTO) {
  //     await this.mailerService.sendMail({
  //       to: sendGridFormDTO.to,
  //       subject: 'Welcome to Candle Bliss',
  //       template: 'new-order-notification',
  //       context: sendGridFormDTO.context,
  //     });
  //   }

  async sendOtp(sendGridFormDTO: SendGridFormDTO) {
    await this.mailerService.sendMail({
      to: sendGridFormDTO.to,
      subject: 'Verification code',
      template: 'verify-email',
      context: sendGridFormDTO.context,
    });
  }
}
