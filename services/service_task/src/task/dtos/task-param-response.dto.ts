import { ApiProperty } from '@nestjs/swagger';

export class TaskParamResponseDto {
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
    type: Number,
    required: true,
  })
  value: number;
}
