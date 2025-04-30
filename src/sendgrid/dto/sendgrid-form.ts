import { ForgetPasswordFormDTO } from './forget-password';
import { NewMailFormDTO } from './new-mail';
import { NewOrderNotificationDto } from './new-order-notification';
import { OtpForm } from './otp';

export class SendGridFormDTO {
  to: string;
  context:
    | NewOrderNotificationDto
    | OtpForm
    | ForgetPasswordFormDTO
    | NewMailFormDTO;
}
