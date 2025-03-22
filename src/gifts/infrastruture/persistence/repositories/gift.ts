import { InjectRepository } from '@nestjs/typeorm';
import { ProductDetail } from '../../../../products/domain/product-detail';
import { NullableType } from '../../../../utils/types/nullable.type';
import { Gifts } from '../../../domain/gift';
import { GiftsRepository } from '../../gift.repository';
import { GiftEntity } from '../entities/gift.entity';
import { In, Repository } from 'typeorm';

export class GiftsRelationalRepsository implements GiftsRepository {
  constructor(
    @InjectRepository(GiftEntity)
    private readonly giftRepository: Repository<GiftEntity>,
  ) {}
  async create(data: Omit<Gifts, 'id'>): Promise<Gifts> {
    return await this.giftRepository.save(
      this.giftRepository.create({ ...data }),
    );
  }
  async update(
    id: Gifts['id'],
    payload: Omit<Gifts, 'id'>,
  ): Promise<NullableType<Gifts>> {
    const entity = await this.giftRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) return null;
    return await this.giftRepository.save(
      this.giftRepository.create({ ...entity, ...payload }),
    );
  }
  async remove(id: Gifts['id']): Promise<void> {
    const entity = await this.giftRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) return;
    entity.isDeleted = true;
    await this.giftRepository.save(entity);
  }
  async findById(id: Gifts['id']): Promise<NullableType<Gifts>> {
    const entity = await this.giftRepository
      .createQueryBuilder('gift')
      .where('gift.id = :id', { id })
      .andWhere('gift.isDeleted = :isDeleted', { isDeleted: false })
      .getOne();

    return entity ? entity : null;
  }
  async findAll(): Promise<NullableType<Gifts[]>> {
    const entities = await this.giftRepository.find({
      where: { isDeleted: false },
    });
    return entities.length ? entities : null;
  }
  async findByProductId(
    productId: ProductDetail['id'],
  ): Promise<NullableType<Gifts>> {
    const entity = await this.giftRepository.findOne({
      where: { productDetails: { id: productId }, isDeleted: false },
    });
    return entity ? entity : null;
  }
  async findByName(name: Gifts['name']): Promise<NullableType<Gifts>> {
    const entity = await this.giftRepository.findOne({
      where: { name, isDeleted: false },
    });
    return entity ? entity : null;
  }
  async findTop(limit: number): Promise<NullableType<Gifts[]>> {
    const entities = await this.giftRepository.find({
      where: { isDeleted: false },
      order: { id: 'DESC' },
      take: limit,
    });
    return entities.length ? entities : null;
  }
  async findGiftsByProductIds(
    productIds: ProductDetail['id'][],
  ): Promise<NullableType<Gifts[]>> {
    const entities = await this.giftRepository.find({
      where: { productDetails: In(productIds), isDeleted: false },
    });
    return entities.length ? entities : null;
  }
}
