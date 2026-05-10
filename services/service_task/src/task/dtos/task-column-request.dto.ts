import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class TaskColumnRequestDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  column: string;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  index: number;
}

export class TaskMultipleColumnRequestDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  column: string;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsArray()
  @IsNumber()
  @IsNotEmpty()
  index: number[];
}

export class TaskColumnsRequestDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  file: string;

  @ApiProperty({
    type: [TaskColumnRequestDto],
    required: true,
  })
  @IsOptional()
  columns?: TaskColumnRequestDto[];

  @ApiProperty({
    type: [TaskMultipleColumnRequestDto],
    required: true,
  })
  @IsOptional()
  multipleColumns?: TaskMultipleColumnRequestDto[];
}
