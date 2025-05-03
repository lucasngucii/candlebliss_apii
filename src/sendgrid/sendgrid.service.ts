import { Injectable } from '@nestjs/common';
import sgMail from '@sendgrid/mail';
import ejs from 'ejs';
import path from 'path';
import {
  SendGridFormDTO
} from './dto';
@Injectable()
export class SendGridService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  }

  private  renderTemplate(template: string, context: any): Promise<string> {
    const filePath = path.join(process.cwd(), 'src', 'sendgrid', 'templates', `${template}.ejs`);
    return ejs.renderFile(filePath, context);
  }

  private async send(to: string, subject: string, template: string, context: any) {
    const html = await this.renderTemplate(template, context);
    return sgMail.send({
      to,
      from: process.env.MAIL_USER as string,
      subject,
      html,
    });
  }

  async sendEmailAdminNewOrderNotification(dto: SendGridFormDTO) {
    return this.send(dto.to, 'Welcome to Candle Bliss', 'new-order-notification', dto.context);
  }

  async sendEmailPaymentOrderSuccess(dto: SendGridFormDTO) {
    return this.send(dto.to, 'Payment Success', 'payment-success', dto.context);
  }

  async sendEmailReceivedOrder(dto: SendGridFormDTO) {
    return this.send(dto.to, 'Order Received', 'received', dto.context);
  }

  async sendForgetPassword(dto: SendGridFormDTO) {
    return this.send(dto.to, 'Reset Password', 'forget-password', dto.context);
  }

  async sendNewMail(dto: SendGridFormDTO) {
    return this.send(dto.to, 'Email Updated', 'new-mail', dto.context);
  }

  async sendOtp(dto: SendGridFormDTO) {
    return this.send(dto.to, 'Verification Code', 'verify-email', dto.context);
  }
}

