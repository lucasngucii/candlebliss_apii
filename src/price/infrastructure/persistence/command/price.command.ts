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
    const { productId, ...updatePrice } = updatePriceDto;

    const price = await this.priceRepository.findById(id);
    if (!price) {
      throw new NotFoundException({
        errors: 'priceNotFound',
      });
    }

    if (!productId) {
      throw new UnprocessableEntityException({
        errors: {
          productId: 'productRequired',
        },
      });
    }

    const product = await this.productDetailRepository.findById(productId);
    if (!product) {
      throw new NotFoundException({
        errors: 'productNotFound',
      });
    }

    await this.commandHistoryCommand.create({
      old_price: price.base_price,
      new_price: updatePrice.discount_price,
      changed_at: new Date(),
      changed_by: 'admin',
      productId,
    });

    return await this.priceRepository.update(id, {
      ...updatePrice,
      product_detail: product,
    });
  }
}
