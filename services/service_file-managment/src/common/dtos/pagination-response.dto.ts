import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class PaginationResponseDto {
  @ApiProperty({
    type: Boolean,
    required: true,
    description: 'Status - end of list',
  })
  @IsNotEmpty()
  @IsBoolean()
  isEnd: boolean;
}
