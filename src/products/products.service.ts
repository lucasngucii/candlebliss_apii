import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ProductRepository } from './infrastucture/persistence/product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './domain/product';
import { UpdateProductDto } from './dto/update-product.dto';
import { NullableType } from '../utils/types/nullable.type';
import { ImagesService } from '../images/images.service';
import { Image } from '../images/domain/image';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly imagesSerivce: ImagesService,
  ) {}
  async createProduct(
    dto: CreateProductDto,
    imagesDto: Express.Multer.File[],
  ): Promise<Product> {
    if (imagesDto.length > 10) {
      throw new UnprocessableEntityException(
        'You can only upload up to 10 images.',
      );
    }
    let image: Image[] = [];
    if (imagesDto) {
      image = await this.imagesSerivce.uploadCloudImages(imagesDto);
    }

    return this.productRepository.create({
      ...dto,
      images: image,
    });
  }

  async update(
    id: Product['id'],
    payload: UpdateProductDto,
    imagesDto: Express.Multer.File[] | undefined,
  ): Promise<NullableType<Product>> {
    if (imagesDto) {
      const uploadedImages =
        await this.imagesSerivce.uploadCloudImages(imagesDto);
      payload = { ...payload, images: uploadedImages };
    }

    const updatedProduct = this.productRepository.update(id, payload);
    if (!updatedProduct) {
      throw new UnprocessableEntityException(
        `Product with id ${id} not found.`,
      );
    }
    return updatedProduct;
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  findOne(id: Product['id']): Promise<NullableType<Product>> {
    return this.productRepository.findById(id);
  }

  findByIds(ids: Product['id'][]): Promise<NullableType<Product[]>> {
    return this.productRepository.findByIds(ids);
  }

  remove(id: Product['id']): Promise<void> {
    return this.productRepository.remove(id);
  }
}
