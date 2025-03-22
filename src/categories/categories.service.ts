import { Injectable } from '@nestjs/common';
import { CommandCategoryService } from './infrastructure/persistence/commands/category';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './domain/category';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueriesCategoryService } from './infrastructure/persistence/queries/category';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly command: CommandCategoryService,
    private readonly queries: QueriesCategoryService,
  ) {}
  create(dto: CreateCategoryDto) {
    return this.command.create(dto);
  }

  update(id: Category['id'], payload: UpdateCategoryDto) {
    return this.command.update(id, payload);
  }

  remove(id: Category['id']) {
    return this.command.remove(id);
  }

  findAll() {
    return this.queries.findAll();
  }

  findById(id: Category['id']) {
    return this.queries.findById(id);
  }

  findByName(name: Category['name']) {
    return this.queries.findByName(name);
  }

  findTop(limit: number) {
    return this.queries.findTop(limit);
  }
}
