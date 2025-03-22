import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVoucherDto {
  @ApiProperty({ example: 'CODE12032', type: String })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ example: 'Description of the voucher', type: String })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 10000, type: Number })
  @IsOptional()
  @Type(() => Number)
  amount_off?: number;

  @ApiProperty({ example: 10, type: Number })
  @IsOptional()
  @Type(() => Number)
  percent_off?: number;

  @ApiProperty({ example: 10000, type: Number })
  @IsOptional()
  @Type(() => Number)
  min_order_value?: number;

  @ApiProperty({ example: 10000, type: Number })
  @IsOptional()
  @Type(() => Number)
  max_voucher_amount?: number;

  @ApiProperty({ example: 100, type: Number })
  @IsOptional()
  @Type(() => Number)
  usage_limit?: number;

  @ApiProperty({ example: 1, type: Number })
  @IsOptional()
  @Type(() => Number)
  usage_per_customer?: number;

  @ApiProperty({ example: '2021-01-01', type: Date })
  @IsNotEmpty()
  @Type(() => Date)
  start_date: Date;

  @ApiProperty({ example: '2021-01-01', type: Date })
  @IsNotEmpty()
  @Type(() => Date)
  end_date: Date;

  @ApiProperty({ example: ['product_id1', 'product2'], type: [Number] })
  @IsOptional()
  @Type(() => Number)
  applicable_products?: number[];

  @ApiProperty({ example: ['category1', 'category2'], type: [String] })
  @IsOptional()
  @Type(() => String)
  applicable_categories?: string[];

  @ApiProperty({ example: true, type: Boolean })
  @IsOptional()
  @Type(() => Boolean)
  new_customers_only?: boolean;

  @ApiProperty({ example: true, type: Boolean })
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;
}
