import { Product } from 'src/products/domain/product';
import { NullableType } from '../../../utils/types/nullable.type';
import { HistoryPrices } from '../../domain/history_prices';

export abstract class HistoryPricesRepository {
  abstract create(data: Omit<HistoryPrices, 'id'>): Promise<HistoryPrices>;
  abstract update(
    id: HistoryPrices['id'],
    payload: Partial<HistoryPrices>,
  ): Promise<NullableType<HistoryPrices>>;
  abstract remove(id: HistoryPrices['id']): Promise<void>;
  abstract findById(
    id: HistoryPrices['id'],
  ): Promise<NullableType<HistoryPrices>>;
  abstract findAll(): Promise<HistoryPrices[]>;
  abstract findByProductId(
    productId: Product['id'],
  ): Promise<NullableType<HistoryPrices[]>>;

  abstract findLastHistoryByProductId(
    productId: Product['id'],
  ): Promise<NullableType<HistoryPrices>>;
}
