import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductDetailRepository } from './infrastucture/persistence/product-detail.repository';
import { CreateProductDetailDto } from './dto/create-product-detail.dto';
import { ImagesService } from '../images/images.service';
import { Image } from '../images/domain/image';
import { ProductRepository } from './infrastucture/persistence/product.repository';
import { ProductDetail } from './domain/product-detail';
import { UpdateProductDetailDto } from './dto/update-product-detail.dto';

@Injectable()
export class ProductDetailService {
  constructor(
    private readonly detailRepository: ProductDetailRepository,
    private readonly imagesService: ImagesService,
    private readonly productRepository: ProductRepository,
  ) {}

  async create(dto: CreateProductDetailDto, imagesDto: Express.Multer.File[]) {
    let images: Image[] = [];
    if (imagesDto.length) {
      images = await this.imagesService.uploadCloudImages(imagesDto);
    }

    const product = await this.productRepository.findById(dto.product_id);

    return await this.detailRepository.create({
      ...dto,
      images,
      product: product,
    });
  }

  async update(
    detailId: ProductDetail['id'],
    updateDetailDto: UpdateProductDetailDto,
    images: Express.Multer.File[],
  ) {
    let newImages: Image[] = [];
    if (images.length) {
      newImages = await this.imagesService.uploadCloudImages(images);
      updateDetailDto = { ...updateDetailDto, images: newImages };
    }
    const updateDetail = await this.detailRepository.update(detailId, updateDetailDto)
    if (!updateDetail) {
      throw new NotFoundException(`Product Detail with id ${detailId} not found`);
    }
    return updateDetail;
  }

  async findById(detailId: ProductDetail['id']): Promise<ProductDetail> {
    const entity = await this.detailRepository.findById(detailId);
    if (!entity) {
      throw new NotFoundException(
        `Product Detail with id ${detailId} not found`,
      );
    }
    return entity;
  }

  async findAll(detailIds: number[]): Promise<ProductDetail[]> {
    const results = await Promise.allSettled(
      detailIds.map((id) => this.detailRepository.findById(id)),
    );
    const productDetails = results
      .filter(
        (result) => result.status === 'fulfilled' && result.value !== null,
      )
      .map((result) => (result as PromiseFulfilledResult<ProductDetail>).value);

    return productDetails;
  }

  async getAllProductDetails(): Promise<ProductDetail[]> {
    return await this.detailRepository.findAll();
  }
  async remove(detailId: ProductDetail['id']): Promise<void> {
    await this.detailRepository.remove(detailId);
  }

  async findByIds(detailIds: ProductDetail['id'][]): Promise<ProductDetail[]> {
    console.log(detailIds);
    const results = await Promise.allSettled(
      detailIds.map((detailId) => this.detailRepository.findById(detailId)),
    );
    const productDetails = results
      .filter(
        (result) => result.status === 'fulfilled' && result.value !== null,
      )
      .map((result) => (result as PromiseFulfilledResult<ProductDetail>).value);

    console.log(productDetails);
    if (productDetails.length === 0) {
      throw new NotFoundException('Product Details not found');
    }

    return productDetails;
  }
}
