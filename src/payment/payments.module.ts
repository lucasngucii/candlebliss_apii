import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '../redis/redis.module';
import { OrdersEntity } from '../orders/entity/order.entity';
import { PaymentService } from './payments.service';
import { PaymentController } from './payments.controller';
import { SendGridModule } from '../sendgrid/sendgrid.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrdersEntity]), RedisModule,SendGridModule],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentsModule {}
