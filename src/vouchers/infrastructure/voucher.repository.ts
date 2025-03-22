import { DeepPartial } from '../../utils/types/deep-partial.type';
import { NullableType } from '../../utils/types/nullable.type';
import { Vouchers } from '../domain/voucher';

export abstract class VoucherRepository {
  abstract create(data: Omit<Vouchers, 'id'>): Promise<Vouchers>;

  abstract update(
    id: Vouchers['id'],
    payload: DeepPartial<Vouchers>,
  ): Promise<Vouchers>;

  abstract setInActice(id: Vouchers['id']): Promise<boolean>;

  abstract setActive(id: Vouchers['id']): Promise<boolean>;

  abstract remove(id: Vouchers['id']): Promise<void>;

  abstract findById(id: Vouchers['id']): Promise<NullableType<Vouchers>>;
  abstract findByCode(code: Vouchers['code']): Promise<NullableType<Vouchers>>;

  abstract findByCodes(
    codes: Vouchers['code'][],
  ): Promise<NullableType<Vouchers[]>>;

  abstract findAll(): Promise<NullableType<Vouchers[]>>;

  abstract findByIds(ids: Vouchers['id'][]): Promise<NullableType<Vouchers[]>>;

  abstract filterByDate(
    start_date: Vouchers['start_date'],
    end_date: Vouchers['end_date'],
  ): Promise<NullableType<Vouchers[]>>;

  abstract findAllIsActive(
    isActive: Vouchers['isActive'],
  ): Promise<NullableType<Vouchers[]>>;
}
