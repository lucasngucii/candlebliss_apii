import { Injectable, NotFoundException } from '@nestjs/common';
import { PricesRepository } from '../price.repository';
import { Price } from '../../../domain/prices';

import { ProductDetail } from '../../../../products/domain/product-detail';

@Injectable()
export class QueryPriceService {
  constructor(private readonly priceRepository: PricesRepository) {}

  async findById(id: Price['id']): Promise<Price> {
    const entity = await this.priceRepository.findById(id);
    if (!entity) {
      throw new NotFoundException('Price not found');
    }
    return entity;
  }
  async findAll(): Promise<Price[]> {
    return await this.priceRepository.findAll();
  }

  async findByProductId(detailId: ProductDetail['id']): Promise<Price[]> {
    const entities = await this.priceRepository.findByProductId(detailId);
    if (!entities) {
      throw new NotFoundException(`Prices for product ${detailId} not found.`);
    }
    return entities;
  }
}
