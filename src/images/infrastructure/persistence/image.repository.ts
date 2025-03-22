import { NullableType } from '../../../utils/types/nullable.type';
import { Image } from '../../domain/image';

export abstract class ImageRepository {
  abstract create(data: Omit<Image, 'id'>): Promise<Image>;
  abstract findById(id: Image['id']): Promise<NullableType<Image>>;
  abstract findByIds(ids: Image['id'][]): Promise<NullableType<Image>[]>;
  abstract update(
    id: Image['id'],
    payload: Partial<Image>,
  ): Promise<NullableType<Image>>;
  abstract remove(id: Image['id']): Promise<void>;
  abstract findImagesByPublicIds(
    publicIds: string[],
  ): Promise<NullableType<Image>[]>;
}
