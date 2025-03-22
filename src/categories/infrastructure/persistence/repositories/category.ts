import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../../domain/category';
import { CategoriesRepository } from '../../category.repository';
import { CategoryEntity } from '../entities/categories.entity';
import { In, Repository } from 'typeorm';
import { NullableType } from '../../../../utils/types/nullable.type';

export class CategoriesRelationalRepository implements CategoriesRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}
  async create(data: Omit<Category, 'id'>): Promise<Category> {
    return await this.categoryRepository.save(
      this.categoryRepository.create({ ...data }),
    );
  }
  async findById(id: Category['id']): Promise<NullableType<Category>> {
    const entity = await this.categoryRepository.findOne({
      where: { id, isDeleted: false },
    });
    return entity ? entity : null;
  }
  async update(
    id: Category['id'],
    payload: Partial<Category>,
  ): Promise<NullableType<Category>> {
    const entity = await this.categoryRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!entity) return null;

    return await this.categoryRepository.save(
      this.categoryRepository.create({ ...entity, ...payload }),
    );
  }
  async remove(id: Category['id']): Promise<void> {
    const entity = await this.categoryRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!entity) return;

    entity.isDeleted = true;
    await this.categoryRepository.save(entity);
  }
  findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ where: { isDeleted: false } });
  }
  async findByName(name: Category['name']): Promise<NullableType<Category>> {
    const entity = await this.categoryRepository.findOne({
      where: { name, isDeleted: false },
    });
    return entity ? entity : null;
  }
  async findByIds(ids: Category['id'][]): Promise<NullableType<Category[]>> {
    const entities = await this.categoryRepository.find({
      where: { id: In(ids), isDeleted: false },
    });
    return entities.length ? entities : null;
  }
  async findTop(limit: number): Promise<NullableType<Category[]>> {
    const entities = await this.categoryRepository.find({
      where: { isDeleted: false },
      order: { id: 'DESC' },
      take: limit,
    });
    return entities.length ? entities : null;
  }
}
