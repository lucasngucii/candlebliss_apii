import { Controller, Get, Inject } from '@nestjs/common';
import { SendGridService } from './sendgrid.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('/sendGrid')
@ApiTags('SendGrid')
export class SendGridController {
  constructor(@Inject() private readonly sendGridService: SendGridService) {}
  @Get('/new-order-notification')
  async sendGird() {
    await this.sendGridService.sendEmailAdminNewOrderNotification({
      to: 'giabao13n@gmail.com',
      context: {
        order_code: 'ORDER-R5MZ-240814-031825',
        order_detail_url: `https://dev.candlebliss.vn/order/review?q=123456`,
        receiver_full_name: 'Mai Xuân Toàn',
        receiver_phone: '0333084060',
        receiver_address:
          '1135 Huỳnh Tấn Phát, Phường Phú Thuận, Quận 7, TP HCM',
        products: [
          {
            product_name: 'Nến thơm',
            product_image: 'https://link.to/your-image.jpg',
            product_quantity: 1,
            product_variant: 'Size: M',
            product_price: '660.000',
          },
        ],
        total_price: '660.000',
        delivery_method: 'Nhà bán tự giao',
        shipping_fee: '0',
        payment_method: 'Thanh toán bằng VN pay',
        total_amount: '660.000',
      },
    });
  }
  @Get('/otp')
  async sendOtp() {
    await this.sendGridService.sendOtp({
      to: 'giabao13n@gmail.com',
      context: {
        verification_code: '123432',
      },
    });
  }
}
