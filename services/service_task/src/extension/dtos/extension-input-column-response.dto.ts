import { ApiProperty } from '@nestjs/swagger';

export class ExtensionColumnParamResponseDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  id: string;

  @ApiProperty({
    type: Boolean,
    required: true,
  })
  isRequired: boolean;

  @ApiProperty({
    type: String,
    required: true,
  })
  title: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  description: string;
}
