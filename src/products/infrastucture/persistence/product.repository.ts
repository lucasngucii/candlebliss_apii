import { NullableType } from 'src/utils/types/nullable.type';
import { Product } from '../../domain/product';

export abstract class ProductRepository {
  abstract create(data: Omit<Product, 'id'>): Promise<Product>;
  abstract update(
    id: Product['id'],
    payload: Partial<Product>,
  ): Promise<NullableType<Product>>;

  abstract remove(id: Product['id']): Promise<void>;
  abstract findById(id: Product['id']): Promise<Product>;
  abstract findAll(): Promise<Product[]>;
  abstract findByIds(ids: Product['id'][]): Promise<NullableType<Product[]>>;
}
