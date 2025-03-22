import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiPropertyOptional({ type: String, example: 'category' })
  @IsString()
  @IsOptional()
  @Type(() => String)
  name?: string;

  @ApiPropertyOptional({ type: String, example: 'categorydescription' })
  @IsString()
  @IsOptional()
  @Type(() => String)
  description?: string;
}
