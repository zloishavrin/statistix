import { Readable } from 'stream';
import { FileType } from '../../file-managment/types/file-types.enum';
import { I18nContext } from 'nestjs-i18n';

export interface IStreamedFile {
  filename: string;
  stream: Readable;
  mimeType: string;
}

export interface IUploadFileStream {
  file: IStreamedFile;
  i18n: I18nContext;
}

export interface IUploadedFile {
  key: string;
  size: number;
  type: FileType;
  originalName: string;
}
