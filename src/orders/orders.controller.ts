import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrdersDto } from './dto/create-order.dto';
import { ApiCreatedResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { OrdersEntity } from './entity/order.entity';
import { QueryOrderByLimitAndOffsetDto, QueryOrdersByStatusDto, UpsertOrderByStatusDto, UpsertOrderPaymentMethodDto } from './dto/query.dto';

@Controller('orders')
@ApiTags('Order')
export class OrdersController {
  constructor(private readonly service: OrdersService) { }

  @Post()
  @ApiCreatedResponse({
    type: OrdersEntity,
  })
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Body() createOrderDto: CreateOrdersDto) {
    return await this.service.upsert(createOrderDto);
  }

  @Get()
  @ApiCreatedResponse({
    type: OrdersEntity,
  })
  @HttpCode(HttpStatus.OK)
  getOrdersByUserId(@Query('user_id') userId: number) {
    return this.service.getOrdersByUserId(userId);
  }

  @Get('status')
  @ApiCreatedResponse({
    type: OrdersEntity,
  })
  @HttpCode(HttpStatus.OK)
  getOrdersByStatus(@Query() query: QueryOrdersByStatusDto) {
    return this.service.getOrderByUserIdAndStatus(query);
  }

  @Get('limit-offset')
  @ApiCreatedResponse({
    type: OrdersEntity,
  })
  @HttpCode(HttpStatus.OK)
  getOrdersByLimitAndOffset(
    @Query() dto: QueryOrderByLimitAndOffsetDto
  ) {
    const { user_id, offset, limit } = dto;
    return this.service.findOrdersByUserId(user_id, offset, limit);
  }
  
  @Get(':id')
  @ApiCreatedResponse({
    type: OrdersEntity,
  })
  @HttpCode(HttpStatus.OK)
  getOrderById(@Query('id') id: number) {
    return this.service.findOrderById(id);
  }

  @Patch(':id/status')
  @ApiCreatedResponse({
    type: OrdersEntity,
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the order to update',
    type: Number,
  })
  @HttpCode(HttpStatus.OK)
  async updateOrder(
    @Param('id') id: number,
    @Query() status: UpsertOrderByStatusDto
  ) {
    return await this.service.findAndUpdateOrderStatusById(id, status);
  }

  @Patch(':id/method-payment')
  @ApiCreatedResponse({
    type: OrdersEntity,
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the order to update',
    type: Number,
  })
  @HttpCode(HttpStatus.OK)
  async updateMethodPayment(
    @Param('id') id: number,
    @Body() methodPayment: UpsertOrderPaymentMethodDto,
  ) {
    return await this.service.findAndUpdateOrderMethodPaymentById(
      id,
      methodPayment,
    );
  }


}