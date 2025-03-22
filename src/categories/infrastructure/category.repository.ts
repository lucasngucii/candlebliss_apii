import { NullableType } from '../../utils/types/nullable.type';
import { Category } from '../domain/category';

export abstract class CategoriesRepository {
  abstract create(data: Omit<Category, 'id'>): Promise<Category>;
  abstract findById(id: Category['id']): Promise<NullableType<Category>>;
  abstract update(
    id: Category['id'],
    payload: Partial<Category>,
  ): Promise<NullableType<Category>>;
  abstract remove(id: Category['id']): Promise<void>;
  abstract findAll(): Promise<NullableType<Category[]>>;
  abstract findByName(name: Category['name']): Promise<NullableType<Category>>;
  abstract findByIds(ids: Category['id'][]): Promise<NullableType<Category[]>>;
  abstract findTop(limit: number): Promise<NullableType<Category[]>>;
}
