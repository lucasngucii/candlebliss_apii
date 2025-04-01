import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PricesRepository } from '../price.repository';
import { CreatePriceDto } from '../../../dto/create-price.dto';
import { Price } from '../../../domain/prices';
import { UpdatePriceDto } from '../../../dto/update-price.dto';
import { CommandHistoryPriceSerivce } from './history-price.command';
import { ProductDetailRepository } from '../../../../products/infrastucture/persistence/product-detail.repository';

@Injectable()
export class CommandPriceService {
  constructor(
    private readonly priceRepository: PricesRepository,
    private readonly productDetailRepository: ProductDetailRepository,
    private readonly commandHistoryCommand: CommandHistoryPriceSerivce,
  ) {}
  async create(createPriceDto: CreatePriceDto) {
    const productDetail = await this.productDetailRepository.findById(
      createPriceDto.productId,
    );
    if (!productDetail) {
      throw new UnprocessableEntityException({
        errors: {
          productId: 'productNotFound',
        },
      });
    }
    return await this.priceRepository.create({
      ...createPriceDto,
      product_detail: productDetail,
    });
  }

  async createPriceGift(
    base: number,
    discount: number,
    start: Date,
    end: Date,
  ) {
    return await this.priceRepository.create({
      base_price: base,
      discount_price: discount,
      start_date: start,
      end_date: end,
    });
  }

  async update(id: Price['id'], updatePriceDto: UpdatePriceDto) {
    const price = await this.priceRepository.findById(id);
    if (!price) {
      throw new NotFoundException({
        errors: 'priceNotFound',
      });
    }

    return await this.priceRepository.update(id, {
      ...updatePriceDto,
    });
  }
}
