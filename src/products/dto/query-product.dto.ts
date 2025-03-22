import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Product } from '../domain/product';

export class FilterProductDto {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  type: string;
}

export class SortProductDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof Product;

  @ApiProperty()
  @IsString()
  order: string;
}
export class QueryProductDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterProductDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterProductDto)
  filters?: FilterProductDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortProductDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortProductDto)
  sort?: SortProductDto[] | null;
}
