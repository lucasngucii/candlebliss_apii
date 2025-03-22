import { ApiProperty } from '@nestjs/swagger';
import { Image } from 'src/images/domain/image';
import { Product } from './product';

export class ProductDetail {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String, example: 'Size M' })
  size?: string;

  @ApiProperty({ type: String, example: 'Huong hoa nhai' })
  type?: string;

  @ApiProperty({ type: Number, example: 100 })
  quantities?: number;

  @ApiProperty({ type: () => [Image] })
  images?: Image[];

  // @ApiProperty({ type: () => Product })
  product?: Product;

  @ApiProperty({ type: Boolean, example: true })
  isActive?: boolean;
}
