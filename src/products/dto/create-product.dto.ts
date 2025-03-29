import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ type: String, example: 'Nen Thom Huong Vai' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String, example: 'Mo ta' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    type: String,
    example: 'https://www.youtube.com/watch?v=675zElzOFuc',
  })
  @IsString()
  @IsOptional()
  video?: string;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  category_id: number;
}
