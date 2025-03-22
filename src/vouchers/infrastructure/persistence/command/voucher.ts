import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVoucherDto } from '../../../dto/create-voucher.dto';
import { VoucherRepository } from '../../voucher.repository';
import { generateCode } from 'src/utils/generate-code';
import { Product } from '../../../../products/domain/product';
import { ProductsService } from '../../../../products/products.service';
import { Vouchers } from '../../../domain/voucher';
import { UpdateVoucherDto } from '../../../dto/update-voucher.dto';

@Injectable()
export class CommandVoucherService {
  constructor(
    private readonly voucherRepository: VoucherRepository,
    private readonly productService: ProductsService,
  ) {}

  private async checkCode(code: Vouchers['code'] | undefined) {
    let createCode: string = '';
    if (code) {
      const existingVoucher = await this.voucherRepository.findByCode(code);
      if (existingVoucher) {
        throw new ConflictException('voucherCodeAlreadyExists');
      }
      createCode = code;
    } else {
      do {
        createCode = generateCode();
        const existingVoucher =
          await this.voucherRepository.findByCode(createCode);
        if (!existingVoucher) {
          break;
        }
      } while (true);
    }
    return createCode;
  }

  private async checkProduct(productIds: Product['id'][] | undefined) {
    const products: Product[] = [];
    if (productIds) {
      const entities = await this.productService.findByIds(productIds);
      if (!entities?.length) {
        throw new NotFoundException('productsNotFound');
      }

      products.push(...entities);
    }
    return products;
  }
  async create(createVoucherDto: CreateVoucherDto) {
    // generate code
    const code = await this.checkCode(createVoucherDto.code);
    // check products
    const products = await this.checkProduct(
      createVoucherDto.applicable_products,
    );
    return await this.voucherRepository.create({
      ...createVoucherDto,
      code,
      applicable_products: products,
    });
  }

  async update(id: Vouchers['id'], updateVoucherDto: UpdateVoucherDto) {
    const entity = await this.voucherRepository.findById(id);

    if (!entity) {
      throw new NotFoundException('voucherNotFound');
    }
    const code = await this.checkCode(updateVoucherDto.code);
    const products = await this.checkProduct(
      updateVoucherDto.applicable_products,
    );

    return await this.voucherRepository.update(id, {
      ...updateVoucherDto,
      code,
      applicable_products: products,
    });
  }

  async setInActive(id: Vouchers['id']): Promise<boolean> {
    const entity = await this.voucherRepository.findById(id);
    if (!entity) {
      throw new NotFoundException('voucherNotFound');
    }

    return await this.voucherRepository.setInActice(id);
  }

  async setActive(id: Vouchers['id']): Promise<boolean> {
    const entity = await this.voucherRepository.findById(id);
    if (!entity) {
      throw new NotFoundException('voucherNotFound');
    }

    return await this.voucherRepository.setActive(id);
  }

  async remove(id: Vouchers['id']) {
    const entity = await this.voucherRepository.findById(id);
    if (!entity) {
      throw new NotFoundException('voucherNotFound');
    }
    await this.voucherRepository.remove(id);
  }
}
