import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../product.repository';
import { NullableType } from 'src/utils/types/nullable.type';
import { Product } from '../../../domain/product';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../entities/product.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class ProductRelationalRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async create(data: Product): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { name: data.name, isDeleted: false },
    });
    if (product) {
      throw new NotFoundException(
        `Product with name ${data.name} already exists.`,
      );
    }
    const entity = this.productRepository.create(data);
    return await this.productRepository.save(entity);
  }

  async update(
    id: Product['id'],
    payload: Partial<Product>,
  ): Promise<NullableType<Product>> {
    const entity = await this.productRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) return null;
    const updatedEntity = this.productRepository.create({
      ...entity,
      ...payload,
    });
    return this.productRepository.save(updatedEntity);
  }
  async remove(id: Product['id']): Promise<void> {
    const entity = await this.productRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) return;
    entity.isDeleted = true;
    await this.productRepository.save(entity);
  }
  async findById(id: Product['id']): Promise<Product> {
    const entity = await this.productRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) {
      throw new NotFoundException(`Product ${id} not found.`);
    }
    return entity;
  }
  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({ where: { isDeleted: false } });
  }

  async findByIds(ids: Product['id'][]): Promise<NullableType<Product[]>> {
    const entities = await this.productRepository.find({
      where: { id: In(ids), isDeleted: false },
    });
    return entities.length ? entities : null;
  }
}
