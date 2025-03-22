import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  SerializeOptions,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Product } from './domain/product';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { CreateProductDto } from './dto/create-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdateProductDto } from './dto/update-product.dto';
import { NullableType } from '../utils/types/nullable.type';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly services: ProductsService) {}

  @ApiCreatedResponse({
    type: Product,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin)
  @UseInterceptors(FilesInterceptor('images'))
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        video: { type: 'string' },
        images: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
    },
  })
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.services.createProduct(createProductDto, images);
  }

  @ApiCreatedResponse({
    type: Product,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        video: { type: 'string' },
        images: { type: 'array', items: { type: 'string', format: 'binary' } },
        productDetail: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              size: { type: 'string' },
              type: { type: 'string' },
              quantities: { type: 'number' },
            },
          },
        },
      },
    },
  })
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<NullableType<Product>> {
    return this.services.update(id, updateProductDto, files);
  }
  @ApiCreatedResponse({
    type: Product,
  })
  @Get()
  findAll(): Promise<Product[]> {
    return this.services.findAll();
  }

  @ApiCreatedResponse({
    type: Product,
  })
  @Get(':id')
  findOneById(@Param('id') id: number): Promise<NullableType<Product>> {
    return this.services.findOne(id);
  }

  @ApiCreatedResponse()
  @SerializeOptions({
    groups: ['admin'],
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin)
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.services.remove(id);
  }
}
