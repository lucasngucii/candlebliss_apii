import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class AuthForgotPasswordDto {
  @ApiProperty({ example: 'lucasaleh@yopmail.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  email: string;
}
