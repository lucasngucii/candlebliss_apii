import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Image } from '../../images/domain/image';
import { Type } from 'class-transformer';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional({ example: 'Nen them', type: String })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Mo ta them', type: String })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://www.youtube.com/watch?v=675zElzOFuc',
    type: String,
  })
  @IsOptional()
  @IsString()
  video?: string;

  @ApiPropertyOptional({ type: () => Image })
  @IsOptional()
  @ValidateNested()
  @Type(() => Image)
  images?: Image[];
}
