import { PaginationResponseDto } from 'src/common/dtos/pagination-response.dto';
import { TaskResponseDto } from './task-response.dto';

export class TaskListResponseDto extends PaginationResponseDto {
  list: TaskResponseDto[];
}
