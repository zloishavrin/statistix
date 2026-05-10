import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../models/task-status.model';

export class TaskResponseDto {
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
  status: TaskStatus;

  @ApiProperty({
    type: String,
    required: true,
  })
  createdAt: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  completedAt?: string;
}
