import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskResponseDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  task: string;
}
