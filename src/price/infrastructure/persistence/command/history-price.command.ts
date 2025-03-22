import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { HistoryPricesRepository } from '../history-price.repository';
import { CreateHistoryPriceDto } from '../../../dto/create-history-price';
import { ProductRepository } from '../../../../products/infrastucture/persistence/product.repository';

@Injectable()
export class CommandHistoryPriceSerivce {
  constructor(
    private readonly historyRepository: HistoryPricesRepository,
    private readonly productRepository: ProductRepository,
  ) {}
  async create(createHistoryPriceDto: CreateHistoryPriceDto) {
    const { productId, ...dto } = createHistoryPriceDto;
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new UnprocessableEntityException({
        errors: {
          productId: 'productNotFound',
        },
      });
    }
    return this.historyRepository.create({ ...dto, product });
  }
}
