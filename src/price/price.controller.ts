import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PriceService } from './price.service';
import { Roles } from '../roles/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Price } from './domain/prices';
import { RoleEnum } from '../roles/roles.enum';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { Product } from '../products/domain/product';
import { HistoryPrices } from './domain/history_prices';
import { ProductDetail } from '../products/domain/product-detail';

@ApiTags('Prices')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
@Controller({
  path: 'prices',
  version: '1',
})
export class PriceController {
  constructor(private readonly service: PriceService) {}

  @ApiCreatedResponse({
    type: Price,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleEnum.admin)
  @Post()
  create(@Body() createPriceDto: CreatePriceDto) {
    return this.service.create(createPriceDto);
  }

  @ApiCreatedResponse({
    type: Price,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleEnum.admin)
  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  update(@Body() createPriceDto: UpdatePriceDto, @Param('id') id: Price['id']) {
    return this.service.update(id, createPriceDto);
  }

  @ApiCreatedResponse({
    type: Price,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findById(@Param('id') id: Price['id']) {
    return this.service.findById(id);
  }

  @ApiCreatedResponse({
    type: [Price],
  })
  @ApiParam({
    name: 'detailId',
    type: Number,
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @Get('product-detail/:detailId')
  findAllByProductId(@Param('detailId') detailId: ProductDetail['id']) {
    return this.service.findByProductId(detailId);
  }

  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    type: [Price],
  })
  @Get()
  findAll() {
    return this.service.findAll();
  }
  // history

  @ApiCreatedResponse({
    type: HistoryPrices,
  })
  @HttpCode(HttpStatus.FOUND)
  @Roles(RoleEnum.admin)
  @ApiParam({
    name: 'productId',
    type: Number,
    required: true,
  })
  @Get('history/last/:productId')
  findLastHistoryByProductId(@Param('productId') productId: Product['id']) {
    return this.service.findLastHistoryByProductId(productId);
  }

  @ApiCreatedResponse({
    type: [HistoryPrices],
  })
  @HttpCode(HttpStatus.FOUND)
  @Roles(RoleEnum.admin)
  @ApiParam({
    name: 'productId',
    type: Number,
    required: true,
  })
  @Get('history/:productId')
  findHistoryByProductId(
    @Param('productId') productId: Product['id'],
  ): Promise<HistoryPrices[]> {
    return this.service.findHistoryByProductId(productId);
  }

  @ApiCreatedResponse({
    type: [HistoryPrices],
  })
  @HttpCode(HttpStatus.FOUND)
  @Roles(RoleEnum.admin)
  @Get('history')
  findAllHistory(): Promise<HistoryPrices[]> {
    return this.service.findAllHistory();
  }

  @ApiCreatedResponse({
    type: HistoryPrices,
  })
  @HttpCode(HttpStatus.FOUND)
  @Roles(RoleEnum.admin)
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @Get('history/:id')
  findHistoryById(
    @Param('id') id: HistoryPrices['id'],
  ): Promise<HistoryPrices> {
    return this.service.findHistoryById(id);
  }
}
