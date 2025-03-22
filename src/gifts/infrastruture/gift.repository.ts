import { ProductDetail } from '../../products/domain/product-detail';
import { NullableType } from '../../utils/types/nullable.type';
import { Gifts } from '../domain/gift';

export abstract class GiftsRepository {
  abstract create(data: Omit<Gifts, 'id'>): Promise<Gifts>;
  abstract update(
    id: Gifts['id'],
    payload: Omit<Gifts, 'id'>,
  ): Promise<NullableType<Gifts>>;

  abstract remove(id: Gifts['id']): Promise<void>;
  abstract findById(id: Gifts['id']): Promise<NullableType<Gifts>>;
  abstract findAll(): Promise<NullableType<Gifts[]>>;
  abstract findByProductId(
    productId: ProductDetail['id'],
  ): Promise<NullableType<Gifts>>;

  abstract findByName(name: Gifts['name']): Promise<NullableType<Gifts>>;
  abstract findTop(limit: number): Promise<NullableType<Gifts[]>>;
  abstract findGiftsByProductIds(
    productIds: ProductDetail['id'][],
  ): Promise<NullableType<Gifts[]>>;
}
