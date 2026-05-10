import {
  CreateBucketCommand,
  GetObjectCommand,
  HeadBucketCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  IUploadedFile,
  IUploadFileStream,
} from './interfaces/upload-file.interface';
import { Upload } from '@aws-sdk/lib-storage';
import Busboy from 'busboy';
import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { FileType } from '../file-managment/types/file-types.enum';
import { I18nContext } from 'nestjs-i18n';
import { PassThrough, Readable } from 'stream';
import path from 'path';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly fileSizeLimit: number;

  private readonly ALLOWED_EXTENSIONS = {
    [FileType.EXCEL]: 'xlsx',
    [FileType.EXCEL_OLD]: 'xls',
    [FileType.CSV]: 'csv',
  } as const;

  private readonly MIME_TYPES = {
    [FileType.EXCEL]:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    [FileType.EXCEL_OLD]: 'application/vnd.ms-excel',
    [FileType.CSV]: 'text/csv',
  } as const;

  constructor(private readonly configService: ConfigService) {
    const s3Url = this.configService.getOrThrow<string>('s3.uri');
    const accessKeyId = this.configService.getOrThrow<string>('s3.accessKeyId');
    const secretAccessKey =
      this.configService.getOrThrow<string>('s3.secretAccessKey');
    const region = this.configService.getOrThrow<string>('s3.region');

    this.s3Client = new S3Client({
      region: region,
      endpoint: s3Url,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
      forcePathStyle: true,
    });

    //this.S3Url = s3Url;
    this.bucketName = this.configService.getOrThrow<string>('s3.bucket');
    this.fileSizeLimit =
      this.configService.getOrThrow<number>('limits.fileSize') * 1024 * 1024; // MB
    void this.ensureBucketExists(this.bucketName);
  }

  /**
   * Download file from S3
   * @param key File key in S3
   * @param fileName Original filename
   * @param type Type of file
   * @param res Express Response
   */
  async downloadFile(
    key: string,
    fileName: string,
    type: FileType,
    res: Response,
  ): Promise<void> {
    const s3Object = await this.s3Client.send(
      new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(fileName)}"`,
    );
    res.setHeader('Content-Type', this.MIME_TYPES[type]);
    res.setHeader('X-File-Name', encodeURIComponent(fileName));
    res.setHeader('X-File-Type', this.MIME_TYPES[type]);
    (s3Object.Body as Readable).pipe(res);
  }

  /**
   * Upload file from HTTP-request
   * @param req Express Request
   * @returns Information about uploaded file
   */
  async uploadFile(req: Request, i18n: I18nContext): Promise<IUploadedFile> {
    return new Promise((resolve, reject) => {
      const busboy = Busboy({
        headers: req.headers,
        limits: {
          fileSize: this.fileSizeLimit,
        },
      });
      let uploadPromise: Promise<IUploadedFile>;

      busboy.on('file', (_fieldname, fileStream, fileInfo) => {
        const sanitizedFilename = this.sanitizeFilename(
          Buffer.from(fileInfo.filename, 'latin1').toString('utf8'),
        );

        const uploaded = this.uploadFileStream({
          file: {
            stream: fileStream,
            filename: sanitizedFilename,
            mimeType: fileInfo.mimeType,
          },
          i18n: i18n,
        });
        uploadPromise = uploaded;
      });

      busboy.on('finish', () => {
        try {
          const results = Promise.resolve(uploadPromise);
          resolve(results);
        } catch (error) {
          reject(error instanceof Error ? error : new Error(String(error)));
        }
      });
      busboy.on('error', (error) =>
        reject(error instanceof Error ? error : new Error(String(error))),
      );
      req.pipe(busboy);
    });
  }

  /**
   * Upload file from stream to S3
   * @param file Object with file stream, filename and mime type
   * @returns Information about uploaded file
   */
  async uploadFileStream({
    file,
    i18n,
  }: IUploadFileStream): Promise<IUploadedFile> {
    let size = 0;
    const fileStream = new PassThrough();

    const inputStream = file.stream;
    inputStream.on('data', (chunk: Buffer) => {
      size += chunk.length;

      if (size > this.fileSizeLimit) {
        throw new BadRequestException(
          i18n.service.t('message.storage.fileSizeLimit'),
        );
      }
    });
    inputStream.pipe(fileStream);

    const key = this.generateKey();
    const type = this.detectType(file.filename, i18n, file.mimeType);

    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.bucketName,
        Key: key,
        Body: fileStream,
      },
    });
    await upload.done();

    return {
      key: key,
      size: size,
      type: type,
      originalName: file.filename,
    };
  }

  /**
   * Validation file type with mime type and extension
   * @param filename Filename
   * @param mimeType MIME-type of file
   * @returns FileType enum
   */
  private detectType(
    filename: string,
    i18n: I18nContext,
    mimeType?: string,
  ): FileType {
    if (mimeType) {
      for (const [type, expectedMime] of Object.entries(this.MIME_TYPES)) {
        if (mimeType === expectedMime) {
          return type as FileType;
        }
      }
    }

    const extension = filename.split('.').pop()?.toLowerCase() || '';
    for (const [type, extensions] of Object.entries(this.ALLOWED_EXTENSIONS)) {
      if (extensions.includes(extension)) {
        return type as FileType;
      }
    }

    throw new BadRequestException(
      i18n.service.t('message.storage.unsupportedType'),
    );
  }

  /**
   * Generate unique key for file
   * @returns Key for file
   */
  private generateKey(): string {
    return `${Date.now()}_${uuid()}`;
  }

  /**
   * Sanitize filename
   * @param filename Source filename
   * @returns Sanitized filename
   */
  private sanitizeFilename(filename: string): string {
    const baseName = path.basename(filename);

    const cleaned = Array.from(baseName)
      .filter((char) => {
        const code = char.charCodeAt(0);

        return !((code >= 0 && code <= 31) || (code >= 128 && code <= 159));
      })
      .join('');

    return cleaned
      .replace(/[<>:"/\\|?*]+/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 255);
  }

  /**
   * Ensure bucket exists in S3
   * @param bucketName Name of bucket
   */
  private async ensureBucketExists(bucketName: string) {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'NotFound') {
        await this.s3Client.send(
          new CreateBucketCommand({ Bucket: bucketName }),
        );
      } else {
        throw new Error(
          `Failed to ensure bucket exists:\n\n${JSON.stringify(error)}\n`,
        );
      }
    }
  }
}
