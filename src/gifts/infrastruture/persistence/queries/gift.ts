import { Injectable, NotFoundException } from '@nestjs/common';
import { GiftsRepository } from '../../gift.repository';
import { Gifts } from '../../../domain/gift';
import { ProductDetail } from '../../../../products/domain/product-detail';

@Injectable()
export class QueriesGiftService {
  constructor(private readonly repository: GiftsRepository) {}

  async findById(id: Gifts['id']): Promise<Gifts> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundException('Gift not found');
    }
    return entity;
  }

  async findAll(): Promise<Gifts[]> {
    const entities = await this.repository.findAll();
    if (!entities || !entities.length) {
      throw new NotFoundException('No gift found');
    }
    return entities;
  }

  async findByProductDetailId(detailId: ProductDetail['id']) {
    const entity = await this.repository.findByProductId(detailId);
    if (!entity) {
      throw new NotFoundException('Gift not found');
    }
    return entity;
  }

  async findByName(name: Gifts['name']): Promise<Gifts> {
    const entities = await this.repository.findByName(name);
    if (!entities) {
      throw new NotFoundException(`No gift found with name ${name}`);
    }
    return entities;
  }

  async findTop(limit: number): Promise<Gifts[]> {
    const entities = await this.repository.findTop(limit);
    if (!entities || !entities.length) {
      throw new NotFoundException('No gift found');
    }
    return entities;
  }

  async findGiftsByProductDetails(
    detailId: ProductDetail['id'][],
  ): Promise<Gifts[]> {
    const entities = await this.repository.findGiftsByProductIds(detailId);
    if (!entities || !entities.length) {
      throw new NotFoundException('No gift found');
    }
    return entities;
  }
}
