import { Injectable, NotFoundException } from '@nestjs/common';
import { GiftsRepository } from '../../gift.repository';
import { CreateGiftsDto } from '../../../dto/create-gift.dto';
import { ProductDetailService } from 'src/products/product-detail.service';
import { PriceService } from 'src/price/price.service';
import { Gifts } from '../../../domain/gift';
import { UpdateGiftDto } from '../../../dto/update-gift.dto';
import { Price } from 'src/price/domain/prices';
import { ImagesService } from 'src/images/images.service';
import { Image } from '../../../../images/domain/image';

@Injectable()
export class CommandGiftsService {
  constructor(
    private readonly repository: GiftsRepository,
    private readonly productDetailService: ProductDetailService,
    private readonly priceService: PriceService,
    private readonly imagesSerivce: ImagesService,
  ) {}

  async create(
    createGiftDto: CreateGiftsDto,
    imagesDto: Express.Multer.File[],
  ): Promise<Gifts> {
    const { productDetailIds, ...dto } = createGiftDto;
    // upload images
    let images: Image[] = [];
    if (imagesDto?.length) {
      images = await this.imagesSerivce.uploadCloudImages(imagesDto);
    }

    // create prices
    let prices: Price | undefined = undefined;
    if (dto.base_price) {
      prices = await this.priceService.createPriceGift(
        dto.base_price,
        dto.discount_price,
        dto.start_date,
        dto.end_date,
      );
    }
    // find productDetails
    const productDetails =
      await this.productDetailService.findByIds(productDetailIds);
    // create gift

    return this.repository.create({
      ...createGiftDto,
      images,
      prices,
      productDetails,
    });
  }

  async update(
    id: Gifts['id'],
    payload: UpdateGiftDto,
    imagesDto: Express.Multer.File[],
  ): Promise<Gifts> {
    const gift = await this.repository.findById(id);
    if (!gift) {
      throw new NotFoundException(`Gift with id ${id} not found`);
    }

    let prices: Price | null = null;
    if (payload.prices && gift.prices) {
      // update prices
      prices = await this.priceService.update(gift.prices.id, payload.prices);
      console.log(prices);
    }
    let images: Image[] = [];
    if (imagesDto.length) {
      // upload images
      images = await this.imagesSerivce.uploadCloudImages(imagesDto);
    }

    const updateGift = {
      ...gift,
      ...payload,
      prices: prices ?? gift.prices,
      images: images ?? gift.images,
    };

    const updated = await this.repository.update(id, updateGift);
    if (!updated) {
      throw new NotFoundException(`Gift with id ${id} not found`);
    }
    return updated;
  }

  async remove(id: Gifts['id']) {
    const gift = await this.repository.findById(id);
    if (!gift) {
      throw new NotFoundException(`Gift with id ${id} not found`);
    }
    return this.repository.remove(id);
  }
}
