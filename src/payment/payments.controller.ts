import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payments.service';

@Controller('payments')
@ApiTags('Payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('create')
  async createPayment(@Query('orderId') orderId: string) {
    return this.paymentService.pay(orderId);
  }

  @Post('callback')
  async callback(@Body() dataReturn) {
    return this.paymentService.callback(dataReturn);
  }
}
