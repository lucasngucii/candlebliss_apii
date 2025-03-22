import { ApiProperty } from '@nestjs/swagger';

export class Image {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String, example: 'http://example.com' })
  path: string;

  @ApiProperty({ type: String, example: 'public_id' })
  public_id: string;
}
