import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateProductDetailDto {
  @ApiProperty({ type: Number })
  @IsInt()
  @Type(() => Number)
  product_id: number;

  @ApiProperty({ type: String, example: 'Size M' })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiProperty({ type: String, example: 'Huong hoa nhai' })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ type: Number, example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  quantities?: number;

  @ApiProperty({ type: Boolean, example: true })
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;
}
