import { Injectable, NotFoundException } from '@nestjs/common';
import { VoucherRepository } from '../../voucher.repository';
import { Vouchers } from '../../../domain/voucher';

@Injectable()
export class QueryVoucherService {
  constructor(private readonly voucherRepository: VoucherRepository) {}

  async findVoucherById(id: Vouchers['id']): Promise<Vouchers> {
    const entity = await this.voucherRepository.findById(id);
    if (!entity) {
      throw new NotFoundException('voucherEntityNotFound');
    }
    return entity;
  }
  async findVoucherByCode(code: Vouchers['code']): Promise<Vouchers> {
    const entity = await this.voucherRepository.findByCode(code);
    if (!entity) {
      throw new NotFoundException('voucherEntityNotFound');
    }
    return entity;
  }

  async findVoucherByCodes(codes: Vouchers['code'][]): Promise<Vouchers[]> {
    const entities = await this.voucherRepository.findByCodes(codes);
    if (!entities?.length) {
      throw new NotFoundException('voucherEntityNotFound');
    }
    return entities;
  }

  async findAllVouchers(): Promise<Vouchers[]> {
    const entities = await this.voucherRepository.findAll();
    if (!entities) {
      throw new NotFoundException('voucherEntityNotFound');
    }
    return entities;
  }
  async findVouchersByIds(ids: Vouchers['id'][]): Promise<Vouchers[]> {
    const entities = await this.voucherRepository.findByIds(ids);
    if (!entities?.length) {
      throw new NotFoundException('voucherEntityNotFound');
    }
    return entities;
  }

  async filterByDate(
    start_date: Vouchers['start_date'],
    end_date: Vouchers['end_date'],
  ): Promise<Vouchers[]> {
    const entities = await this.voucherRepository.filterByDate(
      start_date,
      end_date,
    );
    if (!entities?.length) {
      throw new NotFoundException('voucherEntityNotFound');
    }
    return entities;
  }

  async findAllIsActive(isActive: Vouchers['isActive']): Promise<Vouchers[]> {
    const entities = await this.voucherRepository.findAllIsActive(isActive);
    if (!entities?.length) {
      throw new NotFoundException('voucherEntityNotFound');
    }
    return entities;
  }
}
