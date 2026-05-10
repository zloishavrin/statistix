import { Injectable } from '@nestjs/common';
import { FileDocument } from './models/file.model';
import { FileResponseDto } from './dtos/file-response.dto';

@Injectable()
export class FileManagmentMapper {
  toFileResponseDto(file: FileDocument): FileResponseDto {
    return {
      id: file._id.toString(),
      size: this.formatFileSize(file.size),
      name: file.originalName,
      createdAt: file.createdAt.toISOString(),
    };
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0Б';
    const units = ['Б', 'Кб', 'Мб', 'Гб', 'Тб'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size = size / 1024;
      unitIndex++;
    }

    const formattedSize = size % 1 === 0 ? size.toString() : size.toFixed(1);
    return `${formattedSize} ${units[unitIndex]}`;
  }
}
