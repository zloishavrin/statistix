import { ApiProperty } from '@nestjs/swagger';
import { ExtensionInputParamResponseDto } from './extension-input-param-response.dto';
import { ExtensionColumnParamResponseDto } from './extension-input-column-response.dto';
import { ExtensionMultipleColumnParamResponseDto } from './extension-input-multiple-column-response.dto';

export class ExtensionMethodDetailsResponseDto {
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
    type: [ExtensionInputParamResponseDto],
    required: false,
  })
  params?: ExtensionInputParamResponseDto[];

  @ApiProperty({
    type: [ExtensionColumnParamResponseDto],
    required: false,
  })
  columns?: ExtensionColumnParamResponseDto[];

  @ApiProperty({
    type: [ExtensionMultipleColumnParamResponseDto],
    required: false,
  })
  multipleColumns?: ExtensionMultipleColumnParamResponseDto[];

  @ApiProperty({
    type: [ExtensionInputParamResponseDto],
    required: false,
  })
  outputParams?: ExtensionInputParamResponseDto[];

  @ApiProperty({
    type: [ExtensionColumnParamResponseDto],
    required: false,
  })
  outputColumns?: ExtensionColumnParamResponseDto[];

  @ApiProperty({
    type: [ExtensionMultipleColumnParamResponseDto],
    required: false,
  })
  outputMultipleColumns?: ExtensionMultipleColumnParamResponseDto[];
}
