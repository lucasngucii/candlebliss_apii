import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './persistence/entities/product.entity';
import { ProductRepository } from './persistence/product.repository';
import { ProductRelationalRepository } from './persistence/repository/product';
import { ProductDetailEntity } from './persistence/entities/detail.entity';
import { ProductDetailRepository } from './persistence/product-detail.repository';
import { ProductDetailRelationalRepository } from './persistence/repository/product-detail';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, ProductDetailEntity])],
  providers: [
    { provide: ProductRepository, useClass: ProductRelationalRepository },
    {
      provide: ProductDetailRepository,
      useClass: ProductDetailRelationalRepository,
    },
  ],
  exports: [ProductRepository, ProductDetailRepository],
})
export class RelationalProductPersistenceModule {}
