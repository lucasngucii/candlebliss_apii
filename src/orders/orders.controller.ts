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
import { ApiCreatedResponse, ApiParam, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { OrdersEntity } from './entity/order.entity';
import { AddRatingDto, QueryOrderByLimitAndOffsetDto, QueryOrdersByStatusAllDto, QueryOrdersByStatusDto, StatisticsQueryDto, TimeFilterEnum, UpsertOrderByStatusDto, UpsertOrderPaymentMethodDto } from './dto/query.dto';
import { StatisticsResponseDto } from './dto/res.dto';

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

  @Get('statistics')
  @ApiOperation({
    summary: 'Lấy thống kê doanh thu',
    description: 'API trả về thống kê doanh thu theo tháng, tuần hoặc năm'
  })
  @ApiResponse({
    status: 200,
    description: 'Thống kê doanh thu thành công',
    type: StatisticsResponseDto
  })
  @HttpCode(HttpStatus.OK)
  async getStatistics(@Query() query: StatisticsQueryDto) {
    const { timeFilter = TimeFilterEnum.MONTH, timeValue, year } = query;
    const yearValue = year || new Date().getFullYear();

    let timeValueParam = timeValue;
    if (!timeValueParam) {
      if (timeFilter === TimeFilterEnum.MONTH) {
        timeValueParam = new Date().getMonth() + 1; // Tháng hiện tại (1-12)
      } else if (timeFilter === TimeFilterEnum.WEEK) {
        // Tính số tuần hiện tại trong năm
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const diff = now.getTime() - start.getTime();
        const oneWeek = 1000 * 60 * 60 * 24 * 7;
        timeValueParam = Math.ceil(diff / oneWeek);
      } else {
        timeValueParam = yearValue; // Nếu là năm thì dùng năm hiện tại
      }
    }

    const statistics = await this.service.getStatistics(timeFilter, timeValueParam, yearValue);

    return {
      timeFilter,
      timeValue: timeValueParam,
      year: yearValue,
      totalRevenue: statistics.totalRevenue, // Tổng doanh thu
      totalOrderValue: statistics.totalOrderValue, // Tổng giá trị đơn hàng (không bao gồm phí vận chuyển)
      totalShippingFee: statistics.totalShippingFee, // Tổng phí vận chuyển
      totalOrders: statistics.totalOrders, // Tổng số đơn hàng
      totalQuantities: statistics.totalQuantity, // Tổng số sản phẩm
    };
  }

  @Get('all')
  @ApiCreatedResponse({
    type: OrdersEntity,
  })
  @HttpCode(HttpStatus.OK)
  async getAllOrders() {
    return await this.service.getAllOrders();
  }


  @Get('status')
  @ApiCreatedResponse({
    type: OrdersEntity,
  })
  @HttpCode(HttpStatus.OK)
  getOrdersByStatus(@Query() query: QueryOrdersByStatusDto) {
    return this.service.getOrderByUserIdAndStatus(query);
  }

  @Get('all/status')
  @ApiCreatedResponse({
    type: OrdersEntity,
  })
  @HttpCode(HttpStatus.OK)
  getOrdersByStatusAll(@Query() query: QueryOrdersByStatusAllDto) {
    return this.service.getAllOrderByStatus(query);
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

  @Patch(':id/status/complete')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the order to update',
    type: Number,
  })

  @HttpCode(HttpStatus.OK)
  async updateOrderAndRating(
    @Param('id') id: number,
    @Query() rating: AddRatingDto
  ) {
    return await this.service.findAndUpdateOrderStatusCompletedById(id, rating);
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