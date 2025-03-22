import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { CartEntity } from './entity/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { CartService } from './cart.service';
import { CreateItemDto } from './dto/create-item.dto';

@Controller('cart')
@ApiTags('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiCreatedResponse({
    type: CartEntity,
  })
  @HttpCode(201)
  @Post()
  createCart(@Body() createCartDto: CreateCartDto) {
    return this.cartService.createCart(createCartDto);
  }

  @ApiCreatedResponse({
    type: CartEntity,
  })
  @ApiParam({ name: 'cartId', type: Number })
  @ApiParam({ name: 'productId', type: Number })
  @HttpCode(201)
  @Post(':cartId/add-item/:productId')
  upsertCartItem(
    @Param('cartId') cartId: number,
    @Param('productId') productId: number,
    @Body() createItemDto: CreateItemDto,
  ) {
    return this.cartService.upsertCartItem(
      cartId,
      productId,
      createItemDto.quantity,
    );
  }

  @ApiParam({ name: 'userId', type: Number })
  @Get('user/:userId')
  getCartByUserId(@Param('userId') userId: number) {
    return this.cartService.getCartByUserId(userId);
  }

  @ApiParam({ name: 'cartId', type: Number })
  @Get(':cartId')
  getCartById(@Param('cartId') cartId: number) {
    return this.cartService.getCartById(cartId);
  }
}
