import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FileType } from 'src/file/file.model';

class TaskParamDto {
  @IsString()
  param: string;

  @IsNumber()
  value: number;
}

class TaskColumnDto {
  @IsString()
  column: string;

  @IsNumber()
  index: number;
}

class TaskMiltipleColumnDto {
  @IsString()
  column: string;

  @IsArray()
  @IsNumber({}, { each: true })
  index: number[];
}

class TaskTableFileDto {
  @IsString()
  key: string;

  @IsString()
  type: FileType;

  @IsNumber()
  size: number;
}

class TaskTableDto {
  @ValidateNested()
  @Type(() => TaskTableFileDto)
  file: TaskTableFileDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskColumnDto)
  columns: TaskColumnDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskMiltipleColumnDto)
  multiple_columns: TaskMiltipleColumnDto[];
}

export class TaskQueueResponseDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  language: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskParamDto)
  params?: TaskParamDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => TaskTableDto)
  columns?: TaskTableDto;
}

export class TaskQueueFailedResponseDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  language: string;

  @IsOptional()
  @IsString()
  error_message?: string;
}
