import { Injectable } from '@nestjs/common';

import { CreateVoucherDto } from './dto/create-voucher.dto';
import { CommandVoucherService } from './infrastructure/persistence/command/voucher';
import { Vouchers } from './domain/voucher';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { QueryVoucherService } from './infrastructure/persistence/queries/voucher';

@Injectable()
export class VouchersService {
  constructor(
    private readonly command: CommandVoucherService,
    private readonly query: QueryVoucherService,
  ) {}

  create(dto: CreateVoucherDto) {
    return this.command.create(dto);
  }

  update(id: Vouchers['id'], updateVocherDto: UpdateVoucherDto) {
    return this.command.update(id, updateVocherDto);
  }

  setActive(id: Vouchers['id']) {
    return this.command.setActive(id);
  }

  setInactive(id: Vouchers['id']) {
    return this.command.setInActive(id);
  }

  remove(id: Vouchers['id']) {
    return this.command.remove(id);
  }

  findAll() {
    return this.query.findAllVouchers();
  }

  findById(id: Vouchers['id']) {
    return this.query.findVoucherById(id);
  }

  findByCode(code: Vouchers['code']) {
    return this.query.findVoucherByCode(code);
  }

  findByCodes(codes: Vouchers['code'][]) {
    return this.query.findVoucherByCodes(codes);
  }

  findVouchersByIds(ids: Vouchers['id'][]) {
    return this.query.findVouchersByIds(ids);
  }

  filterByDate(
    start_date: Vouchers['start_date'],
    end_date: Vouchers['end_date'],
  ) {
    return this.query.filterByDate(start_date, end_date);
  }

  findAllIsActive(isActive: Vouchers['isActive']) {
    return this.query.findAllIsActive(isActive);
  }
}
