import { Injectable } from '@nestjs/common';
import { CreatePriceDto } from './dto/create-price.dto';
import { CommandPriceService } from './infrastructure/persistence/command/price.command';
import { Price } from './domain/prices';
import { UpdatePriceDto } from './dto/update-price.dto';
import { QueryPriceService } from './infrastructure/persistence/queries/price.query';
import { Product } from '../products/domain/product';
import { QueryHistoryPricesService } from './infrastructure/persistence/queries/price-history.query';
import { HistoryPrices } from './domain/history_prices';
import { ProductDetail } from '../products/domain/product-detail';

@Injectable()
export class PriceService {
  constructor(
    private readonly commandPrices: CommandPriceService,
    private readonly queryPrices: QueryPriceService,
    private readonly queryHistory: QueryHistoryPricesService,
  ) {}
  create(createPriceDto: CreatePriceDto) {
    return this.commandPrices.create(createPriceDto);
  }

  createPriceGift(base: number, discount: number, start: Date, end: Date) {
    return this.commandPrices.createPriceGift(base, discount, start, end);
  }
  update(id: Price['id'], updatePriceDto: UpdatePriceDto) {
    return this.commandPrices.update(id, updatePriceDto);
  }

  findById(id: Price['id']) {
    return this.queryPrices.findById(id);
  }

  findByProductId(detailId: ProductDetail['id']) {
    return this.queryPrices.findByProductId(detailId);
  }

  findAll() {
    return this.queryPrices.findAll();
  }

  // history

  findHistoryByProductId(productId: Product['id']): Promise<HistoryPrices[]> {
    return this.queryHistory.findHistoryByProductId(productId);
  }

  findLastHistoryByProductId(productId: Product['id']): Promise<HistoryPrices> {
    return this.queryHistory.findLastHistoryByProductId(productId);
  }

  findAllHistory(): Promise<HistoryPrices[]> {
    return this.queryHistory.findAll();
  }

  findHistoryById(id: HistoryPrices['id']): Promise<HistoryPrices> {
    return this.queryHistory.findHistoryById(id);
  }
}
