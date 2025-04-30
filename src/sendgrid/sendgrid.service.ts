import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendGridFormDTO } from './dto';
import { ForgetPasswordFormDTO } from './dto/forget-password';
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

  async sendForgetPassword(sendGridFormDTO: SendGridFormDTO) {
    await this.mailerService.sendMail({
      to: sendGridFormDTO.to,
      subject: 'Forget Password',
      template: 'forget-password',
      context: sendGridFormDTO.context,
    });
  }

  async sendNewMail(sendGridFormDTO: SendGridFormDTO) {
    await this.mailerService.sendMail({
      to: sendGridFormDTO.to,
      subject: 'Update new email',
      template: 'new-mail',
      context: sendGridFormDTO.context,
    });
  }

  async sendOtp(sendGridFormDTO: SendGridFormDTO) {
    await this.mailerService.sendMail({
      to: sendGridFormDTO.to,
      subject: 'Verification code',
      template: 'verify-email',
      context: sendGridFormDTO.context,
    });
  }
}
