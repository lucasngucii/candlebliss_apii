import { Product } from 'src/products/domain/product';
import { NullableType } from 'src/utils/types/nullable.type';
import { HistoryPrices } from '../../../domain/history_prices';
import { HistoryPricesRepository } from '../history-price.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryPricesEntity } from '../entities/history_prices.entity';
import { Repository } from 'typeorm';

export class HistoryPricesRelationalRepository
  implements HistoryPricesRepository
{
  constructor(
    @InjectRepository(HistoryPricesEntity)
    private readonly historyPricesRepository: Repository<HistoryPricesEntity>,
  ) {}
  async create(data: Omit<HistoryPrices, 'id'>): Promise<HistoryPrices> {
    const entity = this.historyPricesRepository.create(data);
    return await this.historyPricesRepository.save(entity);
  }
  async update(
    id: HistoryPrices['id'],
    payload: Partial<HistoryPrices>,
  ): Promise<NullableType<HistoryPrices>> {
    const entity = await this.findById(id);
    if (!entity) return null;
    const updatedEntity = this.historyPricesRepository.create({
      ...entity,
      ...payload,
    });
    return await this.historyPricesRepository.save(updatedEntity);
  }
  async remove(id: HistoryPrices['id']): Promise<void> {
    const entity = await this.historyPricesRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) return;
    entity.isDeleted = true;
    await this.historyPricesRepository.save(entity);
  }
  async findById(
    id: HistoryPrices['id'],
  ): Promise<NullableType<HistoryPrices>> {
    const entity = await this.historyPricesRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) return null;
    return entity;
  }
  findAll(): Promise<HistoryPrices[]> {
    throw new Error('Method not implemented.');
  }
  async findByProductId(
    productId: Product['id'],
  ): Promise<NullableType<HistoryPrices[]>> {
    const entity = await this.historyPricesRepository.find({
      where: { product: { id: productId }, isDeleted: false },
    });
    if (!entity) return null;
    return entity;
  }
  async findLastHistoryByProductId(
    productId: Product['id'],
  ): Promise<NullableType<HistoryPrices>> {
    const entity = await this.historyPricesRepository.findOne({
      where: { product: { id: productId }, isDeleted: false },
      order: { changed_at: 'DESC' },
    });
    if (!entity) return null;
    return entity;
  }
}
