import { ApiProperty } from '@nestjs/swagger';

export class TaskColumnResponseDto {
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
  index: number;
}

export class TaskMultipleColumnResponseDto {
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
    type: [Number],
    required: true,
  })
  index: number[];
}

export class TaskColumnsResponseDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  file: string;

  @ApiProperty({
    type: [TaskColumnResponseDto],
    required: false,
  })
  columns?: TaskColumnResponseDto[];

  @ApiProperty({
    type: [TaskMultipleColumnResponseDto],
    required: false,
  })
  multipleColumns?: TaskMultipleColumnResponseDto[];
}
