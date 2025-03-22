import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './entity/cart.entity';
import { CartItemEntity } from './entity/cart-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity, CartItemEntity])],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
