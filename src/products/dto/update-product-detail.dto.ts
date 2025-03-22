import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateProductDetailDto } from './create-product-detail.dto';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDetailDto extends PartialType(
  CreateProductDetailDto,
) {
  @ApiPropertyOptional({ example: 'Size M', type: String })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiPropertyOptional({ example: 'Huong hoa nhai', type: String })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 100, type: Number })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  quantities?: number;

  @ApiPropertyOptional({ type: Boolean, example: true })
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;
}
