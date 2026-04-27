import { Injectable } from "@nestjs/common";
import { FileDocument } from "./models/file.model";
import { FileResponseDto } from "./dtos/file-response.dto";

@Injectable()
export class FileManagmentMapper {

  toFileResponseDto(file: FileDocument): FileResponseDto {
    return {
      id: file._id.toString(),
      size: file.size,
      name: file.originalName,
      createdAt: file.createdAt.toISOString(),
    };
  }

}