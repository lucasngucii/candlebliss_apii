import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrdersDto } from './dto/create-order.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { OrdersEntity } from './entity/order.entity';

@Controller('orders')
@ApiTags('Order')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Post()
  @ApiCreatedResponse({
    type: OrdersEntity,
  })
  @HttpCode(HttpStatus.CREATED)
  createOrder(@Body() createOrderDto: CreateOrdersDto) {
    return this.service.create(createOrderDto);
  }
}
