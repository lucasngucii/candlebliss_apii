import { NullableType } from 'src/utils/types/nullable.type';
import { Price } from '../../../domain/prices';
import { PricesRepository } from '../price.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { PricesEntity } from '../entities/prices.entity';
import { Repository } from 'typeorm';
import { ProductDetail } from '../../../../products/domain/product-detail';

export class PricesRelationalRepository implements PricesRepository {
  constructor(
    @InjectRepository(PricesEntity)
    private readonly pricesRepsitory: Repository<PricesEntity>,
  ) {}
  async create(data: Omit<Price, 'id'>): Promise<Price> {
    return await this.pricesRepsitory.save(
      this.pricesRepsitory.create({ ...data }),
    );
  }
  async update(
    id: Price['id'],
    payload: Partial<Price>,
  ): Promise<NullableType<Price>> {
    const entity = await this.findById(id);
    if (!entity) return null;
    return await this.pricesRepsitory.save(
      this.pricesRepsitory.create({ ...entity, ...payload }),
    );
  }
  async remove(id: Price['id']): Promise<void> {
    const entity = await this.pricesRepsitory.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) return;
    entity.isDeleted = true;
    await this.pricesRepsitory.save(entity);
  }
  async findById(id: Price['id']): Promise<NullableType<Price>> {
    const entity = await this.pricesRepsitory
      .createQueryBuilder('price')
      .where('price.id = :id', { id })
      .andWhere('price.isDeleted = :isDeleted', { isDeleted: false })
      .getOne();

    return entity ? entity : null;
  }
  async findAll(): Promise<Price[]> {
    return await this.pricesRepsitory
      .createQueryBuilder('price')
      .leftJoinAndSelect('price.product_detail', 'product_detail')
      .where('price.isDeleted = :isDeleted', { isDeleted: false })
      .getMany();
  }
  async findByProductId(
    detailId: ProductDetail['id'],
  ): Promise<NullableType<Price[]>> {
    const queryBuilder = this.pricesRepsitory.createQueryBuilder('price');
    const prices = await queryBuilder
      .leftJoinAndSelect('price.product_detail', 'product_detail')
      .where('product_detail.id = :detailId', { detailId })
      .andWhere('price.isDeleted = :isDeleted', { isDeleted: false })
      .getMany();

    return prices.length ? prices : null;
  }
}
