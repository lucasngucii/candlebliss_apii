import { ApiProperty } from '@nestjs/swagger';

export class Address {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: 'string', example: 'Ho Chi Minh' })
  province: string;

  @ApiProperty({ type: 'string', example: 'District 1' })
  district: string;

  @ApiProperty({ type: 'string', example: 'Ward 1' })
  ward: string;

  @ApiProperty({ type: 'string', example: '10 Ly Tu Trong' })
  street: string;

  @ApiProperty({ type: Number, example: 1 })
  userId?: number;
}
