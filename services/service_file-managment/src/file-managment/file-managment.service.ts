import { Injectable, NotFoundException } from '@nestjs/common';
import { StorageService } from 'src/storage/storage.service';
import { Response, type Request } from 'express';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { File } from './models/file.model';
import { FileManagmentMapper } from './file-managment.mapper';
import { FileResponseDto } from './dtos/file-response.dto';
import { PaginationRequestDto } from 'src/common/dtos/pagination-request.dto';
import { FileListResponseDto } from './dtos/file-list-response.dto';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class FileManagmentService {
  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<File>,
    private readonly fileManagmentMapper: FileManagmentMapper,
    private readonly storageService: StorageService,
  ) {}

  async getFileUrl(
    userId: Types.ObjectId,
    fileId: string,
    res: Response,
  ): Promise<void> {
    const file = await this.fileModel.findById(fileId);
    if (!file) throw new NotFoundException();
    if (file.user.toString() !== userId.toString())
      throw new NotFoundException();

    return this.storageService.downloadFile(
      file.key,
      file.originalName,
      file.type,
      res,
    );
  }

  /**
   * Upload new file to storage
   * @param req Express request
   * @param userId User ID
   * @returns File details information
   */
  async uploadFile(
    req: Request,
    userId: Types.ObjectId,
    i18n: I18nContext,
  ): Promise<FileResponseDto> {
    const fileInfo = await this.storageService.uploadFile(req, i18n);

    const newFile = await this.fileModel.create({
      user: userId,
      key: fileInfo.key,
      type: fileInfo.type,
      size: fileInfo.size,
      originalName: fileInfo.originalName,
      createdAt: new Date(),
    });

    return this.fileManagmentMapper.toFileResponseDto(newFile);
  }

  /**
   * Get paginated file list
   * @param userId
   * @param dto
   */
  async getFileList(
    userId: Types.ObjectId,
    dto: PaginationRequestDto,
  ): Promise<FileListResponseDto> {
    const { page, limit } = dto;

    const files = await this.fileModel
      .find({
        user: userId,
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      list: files.map((file) =>
        this.fileManagmentMapper.toFileResponseDto(file),
      ),
      isEnd: files.length < limit,
    };
  }
}
