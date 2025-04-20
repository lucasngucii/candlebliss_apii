import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersEntity } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';
import { RedisModule } from '../redis/redis.module';
import { ImagesModule } from '../images/images.module';


@Module({
  imports: [TypeOrmModule.forFeature([OrdersEntity, OrderItem]), RedisModule, ImagesModule],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule { }
