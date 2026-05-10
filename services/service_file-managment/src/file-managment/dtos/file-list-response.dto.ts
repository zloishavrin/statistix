import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponseDto } from 'src/common/dtos/pagination-response.dto';
import { FileResponseDto } from './file-response.dto';

export class FileListResponseDto extends PaginationResponseDto {
  @ApiProperty({
    type: [FileResponseDto],
    required: true,
    description: 'List of files',
  })
  list: FileResponseDto[];
}
