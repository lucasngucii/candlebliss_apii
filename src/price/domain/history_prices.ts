import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/domain/product';

export class HistoryPrices {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Number, example: 30000 })
  old_price: number;

  @ApiProperty({ type: Number, example: 25000 })
  new_price: number;

  @ApiProperty({ type: Date, example: new Date() })
  changed_at: Date;

  @ApiProperty({ type: String, example: 'admin 01' })
  changed_by: string;

  @ApiProperty({ type: Product })
  product: Product;
}
