import { ApiProperty } from '@nestjs/swagger';
import { TaskParamRequestDto } from './task-param-request.dto';
import { TaskColumnsRequestDto } from './task-column-request.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskRequestDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  extension: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  method: string;

  @ApiProperty({
    type: [TaskParamRequestDto],
    required: false,
  })
  @IsOptional()
  params?: TaskParamRequestDto[];

  @ApiProperty({
    type: TaskColumnsRequestDto,
    required: false,
  })
  @IsOptional()
  columns?: TaskColumnsRequestDto;
}
