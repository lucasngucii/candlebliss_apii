import { InjectRepository } from '@nestjs/typeorm';
import { NullableType } from '../../../../utils/types/nullable.type';
import { ProductDetail } from '../../../domain/product-detail';
import { ProductDetailRepository } from '../product-detail.repository';
import { ProductDetailEntity } from '../entities/detail.entity';
import { EntityManager, Repository } from 'typeorm';

export class ProductDetailRelationalRepository
  implements ProductDetailRepository
{
  constructor(
    @InjectRepository(ProductDetailEntity)
    private readonly detailRepository: Repository<ProductDetailEntity>,
    private readonly entity: EntityManager,
  ) {}
  async findByIds(
    detailIds: ProductDetail['id'][],
  ): Promise<NullableType<ProductDetail[]>> {
    const entities = await this.detailRepository
      .createQueryBuilder('detail')
      .where('detail.id IN (:...detailIds)', { detailIds })
      .andWhere('detail.isDeleted = false')
      .getMany();
    return entities.length ? entities : null;
  }
  create(data: ProductDetail): Promise<ProductDetail> {
    const entity = this.detailRepository.create({ ...data });
    return this.detailRepository.save(entity);
  }
  async update(
    id: ProductDetail['id'],
    payload: ProductDetail,
  ): Promise<NullableType<ProductDetail>> {
    const entity = await this.findById(id);
    if (!entity) return null;

    const updateEntity = this.detailRepository.create({
      ...entity,
      ...payload,
    });
    return this.detailRepository.save(updateEntity);
  }
  async findById(
    id: ProductDetail['id'],
  ): Promise<NullableType<ProductDetail>> {
    const entity = await this.detailRepository
      .createQueryBuilder('detail')
      .where('detail.id = :id', { id })
      .andWhere('detail.isDeleted = false')
      .getOne();
    return entity ? entity : null;
  }
  async remove(id: ProductDetail['id']): Promise<void> {
    const entity = await this.detailRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) return;
    entity.isDeleted = true;
    await this.detailRepository.save(entity);
  }
}
