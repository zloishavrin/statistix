import { ApiProperty } from '@nestjs/swagger';
import { ExtensionMethodResponseDto } from './extension-method-response.dto';

export class ExtensionDetailsResponseDto {
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
    type: [ExtensionMethodResponseDto],
    required: true,
  })
  methods: ExtensionMethodResponseDto[];
}
