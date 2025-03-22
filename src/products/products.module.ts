import { Module } from '@nestjs/common';
import { RelationalProductPersistenceModule } from './infrastucture/relational-persistence.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ImagesModule } from '../images/images.module';
import { ProductDetailsController } from './product-detail.controller';
import { ProductDetailService } from './product-detail.service';

@Module({
  imports: [RelationalProductPersistenceModule, ImagesModule],
  controllers: [ProductsController, ProductDetailsController],
  providers: [ProductsService, ProductDetailService],
  exports: [ProductsService, ProductDetailService],
})
export class ProductsModule {}
