import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { OrdersEntity, OrderStatus } from '../orders/entity/order.entity';
import { PaymentSuccessEmailDto } from '../sendgrid/dto';
import { SendGridService } from '../sendgrid/sendgrid.service';
import { UserEntity } from '../users/infrastructure/persistence/relational/entities/user.entity';
import { MoMoRequest } from './dto/momo-request.dto';
import { MoMoResponse } from './dto/momo-response.dto';
@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(OrdersEntity)
    private readonly orderRepository: Repository<OrdersEntity>,
    private sendgridService: SendGridService,
  ) {}
  formData(order: string, total: number): MoMoRequest {
    const accessKey = 'F8BBA842ECF85';
    const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const orderInfo = 'pay with MoMo';
    const partnerCode = 'MOMO';
    const redirectUrl = process.env.REDIRECT_URL;
    const ipnUrl = process.env.PUBLIC_URL + '/api/payments/callback';
    const requestType = 'payWithMethod';
    const amount = total;
    const orderId = 'CandleBliss' + new Date().getTime() + 'order' + order;
    const requestId = orderId;
    const extraData = ``;
    const orderGroupId = '';
    const autoCapture = true;
    const lang = 'vi';

    const rawSignature =
      'accessKey=' +
      accessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCode +
      '&redirectUrl=' +
      redirectUrl +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType;

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: 'Test',
      storeId: 'CandleBliss',
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    });

    return {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/create',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };
  }

  async callback(momoResponse) {
    console.log("momoResponse", momoResponse);
    
    const orderId = momoResponse.orderId.split('order')[1];
    if (!orderId) throw new BadGatewayException('MoMo callback error');
    if (momoResponse.resultCode != 0) {
      await this.orderRepository.update(orderId, {
        status: OrderStatus.PAYMENT_FAILED,
      });
      return;
    }

    await this.orderRepository.update(orderId, {
      status: OrderStatus.PAYMENT_SUCCESS,
    });
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin(UserEntity, 'user', 'user.id = order.user_id')
      .addSelect(['user.firstName', 'user.lastName', 'user.email',"order.order_code","order.id","order.total_price"]) 
      .where('order.id = :orderId', { orderId })
      .getRawOne();
    
    const paymentSuccessEmailDto:PaymentSuccessEmailDto = {
      order_code: result.order_code,
      customer_name: result.firstName + ' ' + result.lastName,
      total_amount: result.total_price,
      payment_method: 'MoMo',
      payment_time: new Date().toISOString(),
    };

    await this.sendgridService.sendEmailPaymentOrderSuccess({
      to: result.email,
      context: paymentSuccessEmailDto ,
    })
    return result;
  }

  async pay(orderId: string): Promise<MoMoResponse | OrdersEntity> {
    const statuses = [OrderStatus.CREATED, OrderStatus.PAYMENT_PENDING];

    const queryResult = (await this.orderRepository.query(
      `SELECT total_price, user_id 
   FROM orders 
   WHERE orders.id = $1 
     AND orders.status = ANY($2)`,
      [orderId, statuses],
    )) as OrdersEntity[];

    if (queryResult.length <= 0)
      throw new NotFoundException('Not found this order');
    const foundOrder = queryResult[0];
    if (foundOrder.total_price < 1000) {
      foundOrder.status = OrderStatus.PAYMENT_SUCCESS;
      return await this.orderRepository.save(foundOrder);
    }
    await this.orderRepository.update(orderId, {
      status: OrderStatus.PAYMENT_PENDING,
    });
    setTimeout(async () => {
      const foundOrder = (await this.orderRepository.query(
        'SELECT total_price,user_id FROM orders WHERE orders.id = $1',
        [orderId],
      )) as OrdersEntity;
      if (foundOrder.status == OrderStatus.PAYMENT_PENDING)
        await this.orderRepository.update(orderId, {
          status: OrderStatus.PAYMENT_FAILED,
        });
    }, 60 * 60 * 1000);
    const result = await axios(
      this.formData(`${orderId}`, foundOrder.total_price),
    );
    return result.data;
  }
}
