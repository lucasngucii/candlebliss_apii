import { NewOrderNotificationDto } from './new-order-notification';
import { OtpForm } from './otp';

export class SendGridFormDTO {
  to: string;
  context: NewOrderNotificationDto | OtpForm;
}
