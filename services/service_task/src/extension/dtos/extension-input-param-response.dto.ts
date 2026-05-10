import { ApiProperty } from '@nestjs/swagger';

export class ExtensionInputParamResponseDto {
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

  @ApiProperty({
    type: String,
    required: true,
  })
  description: string;

  @ApiProperty({
    type: Boolean,
    required: true,
  })
  isRequired: boolean;

  @ApiProperty({
    type: Number,
    required: false,
  })
  min?: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  max?: number;
}
