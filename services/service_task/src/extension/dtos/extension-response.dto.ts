import { ApiProperty } from '@nestjs/swagger';

export class ExtensionResponseDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  id: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  title: string;
}
