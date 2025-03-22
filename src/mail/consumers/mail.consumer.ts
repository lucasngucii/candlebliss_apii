import { Process, Processor } from '@nestjs/bull';
import {
  MAIL_QUEUE,
  SEND_CONFIRM_EMAIL,
  SEND_MAIL_FORGOT_PASSWORD,
  SEND_MAIL_SIGNUP,
} from 'src/utils/constants/queue.constant';
import { MailerService } from 'src/mailer/mailer.service';
import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { MailData } from '../interfaces/mail-data.interface';
import path from 'path';
import { MaybeType } from 'src/utils/types/maybe.type';

@Processor(MAIL_QUEUE)
export class MailSignUpConsumer {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  @Process(SEND_MAIL_SIGNUP)
  async signUpQueue(
    job: Job<{
      mailData: MailData<{ hash: string }>;
      url: string;
      emailConfirmTitle: MaybeType<string>;
      text1: MaybeType<string>;
      text2: MaybeType<string>;
      text3: MaybeType<string>;
    }>,
  ) {
    const { mailData, url, emailConfirmTitle, ...texts } = job.data;
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: emailConfirmTitle,
      text: `${url} ${emailConfirmTitle}`,
      templatePath: path.join(
        this.configService.getOrThrow('app.workingDirectory', {
          infer: true,
        }),
        'src',
        'mail',
        'mail-templates',
        'activation.hbs',
      ),
      context: {
        title: emailConfirmTitle,
        url: url.toString(),
        actionTitle: emailConfirmTitle,
        app_name: this.configService.get('app.name', { infer: true }),
        ...texts,
      },
    });
  }

  @Process(SEND_MAIL_FORGOT_PASSWORD)
  async forgotPasswordQueue(
    job: Job<{
      mailData: MailData<{ hash: string; tokenExpires: number }>;
      resetPasswordTitle: MaybeType<string>;
      url: string;
      text1: MaybeType<string>;
      text2: MaybeType<string>;
      text3: MaybeType<string>;
      text4: MaybeType<string>;
    }>,
  ) {
    const { mailData, resetPasswordTitle, url, ...texts } = job.data;

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: resetPasswordTitle,
      text: `${url} ${resetPasswordTitle}`,
      templatePath: path.join(
        this.configService.getOrThrow('app.workingDirectory', {
          infer: true,
        }),
        'src',
        'mail',
        'mail-templates',
        'reset-password.hbs',
      ),
      context: {
        title: resetPasswordTitle,
        url: url.toString(),
        actionTitle: resetPasswordTitle,
        app_name: this.configService.get('app.name', {
          infer: true,
        }),
        ...texts,
      },
    });
  }

  @Process(SEND_CONFIRM_EMAIL)
  async confirmEmailQueue(
    job: Job<{
      mailData: MailData<{ hash: string }>;
      url: string;
      emailConfirmTitle: MaybeType<string>;
      text1: MaybeType<string>;
      text2: MaybeType<string>;
      text3: MaybeType<string>;
    }>,
  ) {
    const { mailData, url, emailConfirmTitle, ...texts } = job.data;
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: emailConfirmTitle,
      text: `${url.toString()} ${emailConfirmTitle}`,
      templatePath: path.join(
        this.configService.getOrThrow('app.workingDirectory', {
          infer: true,
        }),
        'src',
        'mail',
        'mail-templates',
        'confirm-new-email.hbs',
      ),
      context: {
        title: emailConfirmTitle,
        url: url.toString(),
        actionTitle: emailConfirmTitle,
        app_name: this.configService.get('app.name', { infer: true }),
        ...texts,
      },
    });
  }
}
