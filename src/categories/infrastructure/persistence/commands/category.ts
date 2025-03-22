import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../../category.repository';
import { CreateCategoryDto } from '../../../dto/create-category.dto';
import { Category } from '../../../domain/category';
import { UpdateCategoryDto } from '../../../dto/update-category.dto';

@Injectable()
export class CommandCategoryService {
  constructor(private readonly repository: CategoriesRepository) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.repository.create(createCategoryDto);
  }

  update(id: Category['id'], payload: UpdateCategoryDto) {
    return this.repository.update(id, payload);
  }

  remove(id: Category['id']) {
    return this.repository.remove(id);
  }
}
