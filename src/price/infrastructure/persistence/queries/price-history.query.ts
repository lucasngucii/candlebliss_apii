import { Injectable, NotFoundException } from '@nestjs/common';
import { HistoryPricesRepository } from '../history-price.repository';
import { Product } from 'src/products/domain/product';
import { HistoryPrices } from '../../../domain/history_prices';

@Injectable()
export class QueryHistoryPricesService {
  constructor(private readonly historyRepository: HistoryPricesRepository) {}

  async findHistoryByProductId(
    productId: Product['id'],
  ): Promise<HistoryPrices[]> {
    const entity = await this.historyRepository.findByProductId(productId);
    if (!entity) {
      throw new NotFoundException(`No history found for product ${productId}`);
    }
    return entity;
  }

  async findLastHistoryByProductId(
    productId: Product['id'],
  ): Promise<HistoryPrices> {
    const entity =
      await this.historyRepository.findLastHistoryByProductId(productId);
    if (!entity) {
      throw new NotFoundException(`No history found for product ${productId}`);
    }
    return entity;
  }

  async findAll(): Promise<HistoryPrices[]> {
    const entities = await this.historyRepository.findAll();
    if (!entities.length) {
      throw new NotFoundException('No history found');
    }
    return entities;
  }

  async findHistoryById(id: HistoryPrices['id']): Promise<HistoryPrices> {
    const entity = await this.historyRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`History with id ${id} not found`);
    }
    return entity;
  }
}
