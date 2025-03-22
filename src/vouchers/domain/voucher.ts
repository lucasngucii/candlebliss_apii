import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/domain/product';
import { Type } from 'class-transformer';

export class Vouchers {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  id: number;

  @ApiProperty({ type: String, example: 'CODE12345' })
  @Type(() => String)
  code: string;

  @ApiProperty({ type: String, example: 'Mo ta code su dung nhu the nao' })
  description?: string;

  @ApiProperty({ type: Number, example: 10000 })
  amount_off?: number;

  @ApiProperty({ type: Number, example: 10 })
  percent_off?: number;

  @ApiProperty({ type: Number, example: 100.01 })
  min_order_value?: number;

  @ApiProperty({ type: Number, example: 100.01 })
  max_voucher_amount?: number;

  @ApiProperty({ type: Number, example: 10 })
  usage_limit?: number;

  @ApiProperty({ type: Number, example: 10 })
  usage_per_customer?: number;

  @ApiProperty({ type: Date, example: new Date() })
  start_date: Date;

  @ApiProperty({ type: Date, example: new Date() })
  end_date: Date;

  @ApiProperty({ type: () => [Product] })
  applicable_products?: Product[];

  @ApiProperty({ type: [String] })
  applicable_categories?: string[];

  @ApiProperty({ type: Boolean, example: true, default: true })
  new_customers_only?: boolean;

  @ApiProperty({ type: Boolean, example: true, default: true })
  isActive?: boolean;
}
