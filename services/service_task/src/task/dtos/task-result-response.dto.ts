import { ApiProperty } from '@nestjs/swagger';
import { TaskParamResponseDto } from './task-param-response.dto';
import { TaskColumnsResponseDto } from './task-column-response.dto';

export class TaskResultResponseDto {
  @ApiProperty({
    type: [TaskParamResponseDto],
    required: false,
  })
  params?: TaskParamResponseDto[];

  @ApiProperty({
    type: TaskColumnsResponseDto,
    required: false,
  })
  columns?: TaskColumnsResponseDto;
}
