import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../models/task-status.model';
import { TaskColumnsResponseDto } from './task-column-response.dto';
import { TaskParamResponseDto } from './task-param-response.dto';
import { TaskResultResponseDto } from './task-result-response.dto';

export class TaskDetailsResponseDto {
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
    type: [TaskParamResponseDto],
    required: false,
  })
  inputParams?: TaskParamResponseDto[];

  @ApiProperty({
    type: TaskColumnsResponseDto,
    required: false,
  })
  inputColumns?: TaskColumnsResponseDto;

  @ApiProperty({
    type: String,
    required: true,
  })
  status: TaskStatus;

  @ApiProperty({
    type: String,
    required: false,
  })
  errorMessage?: string;

  @ApiProperty({
    required: false,
    type: TaskResultResponseDto,
  })
  result?: TaskResultResponseDto;

  @ApiProperty({
    type: String,
    required: true,
  })
  createdAt: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  completedAt?: string;
}
