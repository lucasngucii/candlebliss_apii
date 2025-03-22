import { ApiProperty } from '@nestjs/swagger';
import { Image } from '../../images/domain/image';

export class Product {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String, example: 'Nen Thom Huong Vai' })
  name: string;

  @ApiProperty({ type: String, example: 'Mo ta' })
  description: string;

  @ApiProperty({
    type: String,
    example: 'https://www.youtube.com/watch?v=675zElzOFuc',
  })
  video?: string;

  @ApiProperty({ type: () => Image })
  images: Image[];
}
