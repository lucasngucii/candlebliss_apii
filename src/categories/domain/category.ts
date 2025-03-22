import { ApiProperty } from '@nestjs/swagger';

export class Category {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: 'string', example: 'Electronics' })
  name: string;

  @ApiProperty({ type: 'string', example: 'mo ta' })
  descriptions?: string;
}
