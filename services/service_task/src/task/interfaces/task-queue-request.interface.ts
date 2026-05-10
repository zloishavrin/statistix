import { FileType } from 'src/file/file.model';

export interface TaskQueueRequest {
  id: string;
  language: string;
  columns?: {
    file: {
      key: string;
      type: FileType;
      size: number;
    };
    columns?: {
      column: string;
      index: number;
    }[];
    multiple_columns?: {
      column: string;
      index: number[];
    }[];
  };
  params?: {
    param: string;
    value: number;
  }[];
}
