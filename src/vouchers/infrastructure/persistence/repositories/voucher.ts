import { InjectRepository } from '@nestjs/typeorm';
import { NullableType } from '../../../../utils/types/nullable.type';
import { Vouchers } from '../../../domain/voucher';
import { VoucherRepository } from '../../voucher.repository';
import { VouchersEntity } from '../entities/voucher.entity';
import { In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { UnprocessableEntityException } from '@nestjs/common';

export class VoucherRelationalRepository implements VoucherRepository {
  constructor(
    @InjectRepository(VouchersEntity)
    private readonly voucherRepository: Repository<VouchersEntity>,
  ) {}
  async setActive(id: Vouchers['id']): Promise<boolean> {
    const entity = await this.voucherRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) {
      throw new UnprocessableEntityException('voucherEntityNotFound');
    }

    if (!entity.isActive) {
      entity.isActive = true;
      await this.voucherRepository.save(entity);
    }
    return true;
  }
  async remove(id: Vouchers['id']): Promise<void> {
    const entity = await this.voucherRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) {
      throw new UnprocessableEntityException('voucherEntityNotFound');
    }
    entity.isDeleted = true;
    await this.voucherRepository.save(entity);
  }
  async create(data: Omit<Vouchers, 'id'>): Promise<Vouchers> {
    return await this.voucherRepository.save(
      this.voucherRepository.create({ ...data }),
    );
  }
  async update(
    id: Vouchers['id'],
    payload: Partial<Vouchers>,
  ): Promise<Vouchers> {
    const entity = await this.voucherRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) {
      throw new UnprocessableEntityException('voucherEntityNotFound');
    }

    const updatedEntity = this.voucherRepository.create({
      ...entity,
      ...payload,
    });

    return await this.voucherRepository.save(updatedEntity);
  }
  async setInActice(id: Vouchers['id']): Promise<boolean> {
    const entity = await this.voucherRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) {
      throw new UnprocessableEntityException('voucherEntityNotFound');
    }

    entity.isActive = false;
    await this.voucherRepository.save(entity);
    return true;
  }
  async findById(id: Vouchers['id']): Promise<NullableType<Vouchers>> {
    const entity = await this.voucherRepository.findOne({
      where: { id, isDeleted: false },
    });
    return entity ? entity : null;
  }
  async findAll(): Promise<NullableType<Vouchers[]>> {
    const entities = await this.voucherRepository.find({
      where: { isDeleted: false },
    });
    return entities.length ? entities : null;
  }
  async findByIds(ids: Vouchers['id'][]): Promise<NullableType<Vouchers[]>> {
    const entities = await this.voucherRepository.find({
      where: { id: In(ids), isDeleted: false },
    });
    return entities ? entities : null;
  }
  async filterByDate(
    start_date: Vouchers['start_date'],
    end_date: Vouchers['end_date'],
  ): Promise<NullableType<Vouchers[]>> {
    const entities = await this.voucherRepository.find({
      where: {
        start_date: LessThanOrEqual(end_date),
        end_date: MoreThanOrEqual(start_date),
      },
    });

    return entities.length ? entities : null;
  }
  async findAllIsActive(
    isActive: Vouchers['isActive'],
  ): Promise<NullableType<Vouchers[]>> {
    const entities = await this.voucherRepository.find({
      where: { isActive, isDeleted: false },
    });
    return entities ? entities : null;
  }

  async findByCode(code: Vouchers['code']): Promise<NullableType<Vouchers>> {
    const entity = await this.voucherRepository.findOne({
      where: { code, isDeleted: false },
    });
    return entity ? entity : null;
  }

  async findByCodes(
    codes: Vouchers['code'][],
  ): Promise<NullableType<Vouchers[]>> {
    const entities = await this.voucherRepository.find({
      where: { code: In(codes), isDeleted: false },
    });
    return entities ? entities : null;
  }
}
