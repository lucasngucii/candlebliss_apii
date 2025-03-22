import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { InfrastructureRelationalCategoriesModule } from './infrastructure/persistence/persistence.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [InfrastructureRelationalCategoriesModule],
})
export class CategoriesModule {}
