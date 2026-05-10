import { ApiProperty } from '@nestjs/swagger';
import { PaginationRequestDto } from 'src/common/dtos/pagination-request.dto';
import { TaskStatus } from '../models/task-status.model';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class TaskListRequestDto extends PaginationRequestDto {
  @ApiProperty({
    type: String,
    required: false,
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsString()
  @IsEnum(['asc', 'desc'])
  sort: 'asc' | 'desc' = 'desc';

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  status: TaskStatus;
}
