import { ForgetPasswordFormDTO } from './forget-password';
import { NewMailFormDTO } from './new-mail';
import { NewOrderNotificationDto } from './new-order-notification';
import { OtpForm } from './otp';
import { PaymentSuccessEmailDto } from './payment-success';
import { OrderReceivedEmailDto } from './received-order';

export class SendGridFormDTO {
  to: string;
  context:
    | NewOrderNotificationDto
    | OtpForm
    | ForgetPasswordFormDTO
    | NewMailFormDTO
    | PaymentSuccessEmailDto
    | OrderReceivedEmailDto;
}
