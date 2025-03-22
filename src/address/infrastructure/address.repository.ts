import { NullableType } from '../../utils/types/nullable.type';
import { Address } from '../domain/address';

export abstract class AddressRepository {
  abstract create(data: Omit<Address, 'id'>): Promise<Address>;
  abstract findById(id: Address['id']): Promise<NullableType<Address>>;

  abstract update(
    id: Address['id'],
    payload: Partial<Address>,
  ): Promise<NullableType<Address>>;
  abstract remove(id: Address['id']): Promise<void>;
  abstract findManyByUserId(userId: number | string): Promise<Address[]>;
}
