import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ProductDetail } from './domain/product-detail';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateProductDetailDto } from './dto/create-product-detail.dto';
import { ProductDetailService } from './product-detail.service';
import { UpdateProductDetailDto } from './dto/update-product-detail.dto';

@ApiTags('Product Details')
@Controller('product-details')
export class ProductDetailsController {
  constructor(private readonly detailService: ProductDetailService) {}
  @ApiCreatedResponse({
    type: ProductDetail,
  })
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        product_id: { type: 'number' },
        size: { type: 'string' },
        type: { type: 'string' },
        quantities: { type: 'number' },
        values: { type: 'string' },
        isActive: { type: 'boolean' },
        images: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
    },
  })
  @Post()
  create(
    @Body() createDetailDto: CreateProductDetailDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.detailService.create(createDetailDto, images);
  }

  @ApiCreatedResponse({
    type: ProductDetail,
  })
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Product Detail ID',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        size: { type: 'string', nullable: true },
        type: { type: 'string', nullable: true },
        quantities: { type: 'number', nullable: true },
        values: { type: 'string' },
        isActive: { type: 'boolean' },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary', nullable: true },
        },
      },
    },
  })
  @Patch(':id')
  update(
    @Param('id') detailId: ProductDetail['id'],
    @Body()
    updateDetailDto: UpdateProductDetailDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.detailService.update(detailId, updateDetailDto, images);
  }

  @ApiCreatedResponse({
    type: ProductDetail,
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Product Detail ID',
  })
  @Delete(':id')
  delete(@Param('id') detailId: ProductDetail['id']) {
    return this.detailService.remove(detailId);
  }

  @ApiCreatedResponse({
    type: ProductDetail,
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Product Detail ID',
  })
  @Get(':id')
  findById(@Param('id') detailId: ProductDetail['id']): Promise<ProductDetail> {
    return this.detailService.findById(detailId);
  }
}
