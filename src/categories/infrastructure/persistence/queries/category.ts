import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from '../../category.repository';
import { Category } from '../../../domain/category';

@Injectable()
export class QueriesCategoryService {
  constructor(private readonly repository: CategoriesRepository) {}
  async findAll(): Promise<Category[]> {
    const entities = await this.repository.findAll();
    if (!entities?.length) {
      throw new NotFoundException('Category not found');
    }
    return entities;
  }

  async findById(id: Category['id']): Promise<Category> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return entity;
  }

  async findByName(name: Category['name']): Promise<Category> {
    const entity = await this.repository.findByName(name);
    if (!entity) {
      throw new NotFoundException(`Category with name ${name} not found`);
    }
    return entity;
  }

  async findTop(limit: number): Promise<Category[]> {
    const entities = await this.repository.findTop(limit);
    if (!entities?.length) {
      throw new NotFoundException('Category not found');
    }
    return entities;
  }
}
