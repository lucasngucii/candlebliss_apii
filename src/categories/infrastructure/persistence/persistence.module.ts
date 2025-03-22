import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/categories.entity';
import { CategoriesRepository } from '../category.repository';
import { CategoriesRelationalRepository } from './repositories/category';
import { CommandCategoryService } from './commands/category';
import { QueriesCategoryService } from './queries/category';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  providers: [
    {
      provide: CategoriesRepository,
      useClass: CategoriesRelationalRepository,
    },
    CommandCategoryService,
    QueriesCategoryService,
  ],
  exports: [
    CategoriesRepository,
    CommandCategoryService,
    QueriesCategoryService,
  ],
})
export class InfrastructureRelationalCategoriesModule {}
