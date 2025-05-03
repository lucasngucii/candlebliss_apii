import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import * as path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SendGridService } from './sendgrid.service';
import { SendGridController } from './sendgrid.controller';
@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        transport: {
          host: 'smtp.sendgrid.net',
          secure: true,
          auth: {
            user: 'apikey',
            pass: process.env.SENDGRID_API_KEY,
          },
        },
        defaults: {
          from: '21081521.tu@student.iuh.edu.vn',
        },
        template: {
          dir: path.join(process.cwd(), 'src', 'sendgrid', 'templates'),
          adapter: new EjsAdapter(),
          options: {
            extname: '.ejs',
          },
        },
      }),
    }),
    ConfigModule,
  ],
  controllers: [SendGridController],
  providers: [SendGridService],
  exports: [SendGridService],
})
export class SendGridModule {}
