import { Controller, Get, Param, Post, Query, Req, Res } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileManagmentService } from './file-managment.service';
import type { Response, Request } from 'express';
import { Types } from 'mongoose';
import { FileResponseDto } from './dtos/file-response.dto';
import { FileListResponseDto } from './dtos/file-list-response.dto';
import { PaginationRequestDto } from 'src/common/dtos/pagination-request.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { Blob } from 'buffer';

@ApiTags('File Managment')
@Controller('/api/file-managment')
export class FileManagmentController {
  constructor(private fileManagmentService: FileManagmentService) {}

  @Get('url/:fileId')
  @ApiOperation({ summary: 'Download file' })
  @ApiOkResponse({
    type: Blob,
    description: 'File',
  })
  async downloadFile(
    @UserId() userId: Types.ObjectId,
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ): Promise<void> {
    return this.fileManagmentService.getFileUrl(userId, fileId, res);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Файл',
        },
      },
      required: ['file'],
    },
  })
  @ApiOkResponse({
    description: 'Information about uploaded file',
    type: FileResponseDto,
  })
  async uploadFile(
    @Req() req: Request,
    @UserId() userId: Types.ObjectId,
    @I18n() i18n: I18nContext,
  ): Promise<FileResponseDto> {
    return this.fileManagmentService.uploadFile(req, userId, i18n);
  }

  @Get('list')
  @ApiOperation({ summary: 'Get list of files' })
  @ApiOkResponse({
    description: 'List of files',
    type: FileListResponseDto,
  })
  async getFileList(
    @Query() query: PaginationRequestDto,
    @UserId() userId: Types.ObjectId,
  ): Promise<FileListResponseDto> {
    return this.fileManagmentService.getFileList(userId, query);
  }
}
