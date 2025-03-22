import { NullableType } from 'src/utils/types/nullable.type';
import { ProductDetail } from '../../domain/product-detail';

export abstract class ProductDetailRepository {
  abstract create(data: Omit<ProductDetail, 'id'>): Promise<ProductDetail>;
  abstract update(
    id: ProductDetail['id'],
    payload: Omit<ProductDetail, 'id'>,
  ): Promise<NullableType<ProductDetail>>;

  abstract findById(
    id: ProductDetail['id'],
  ): Promise<NullableType<ProductDetail>>;

  abstract remove(id: ProductDetail['id']): Promise<void>;
  abstract findAllByProductId(productId: number): Promise<ProductDetail[]>;
  abstract findByIds(
    detailIds: ProductDetail['id'][],
  ): Promise<NullableType<ProductDetail[]>>;
}
