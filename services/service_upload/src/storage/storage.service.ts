import { CreateBucketCommand, GetObjectCommand, HeadBucketCommand, S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IUploadedFile, IUploadFileStream } from './interfaces/upload-file.interface';
import { Upload } from "@aws-sdk/lib-storage";
import Busboy from 'busboy';
import { Request } from 'express';
import { v4 as uuid } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { FileType } from '../file-managment/types/file-types.enum';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  //private readonly S3Url: string;
  private readonly fileSizeLimit: number;
  private readonly expireTime = 60 * 60 * 1; // 1 hour

  private readonly ALLOWED_EXTENSIONS = {
    [FileType.EXCEL]: 'xlsx',
    [FileType.EXCEL_OLD]: 'xls',
    [FileType.CSV]: 'csv',
  } as const;

  private readonly MIME_TYPES = {
    [FileType.EXCEL]: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    [FileType.EXCEL_OLD]: 'application/vnd.ms-excel',
    [FileType.CSV]: 'text/csv',
  } as const;

  constructor(
    private readonly configService: ConfigService,
  ) {
    const s3Url = this.configService.getOrThrow<string>("s3.uri");
    const accessKeyId = this.configService.getOrThrow<string>("s3.accessKeyId");
    const secretAccessKey = this.configService.getOrThrow<string>("s3.secretAccessKey");
    const region = this.configService.getOrThrow<string>("s3.region");

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
    this.bucketName = this.configService.getOrThrow<string>("s3.bucket");
    this.fileSizeLimit = this.configService.getOrThrow<number>("limits.fileSize");
    this.ensureBucketExists(this.bucketName);
  }

  /**
   * Get signed url for access file
   * @param key S3 Key
   * @returns Signed url
   */
  async getFileUrl(
    key: string,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const signedUrl = await getSignedUrl(
      this.s3Client,
      command,
      {
        expiresIn: this.expireTime,
      },
    );

    return signedUrl;
  }

  /**
   * Upload file from HTTP-request
   * @param req Express Request
   * @returns Information about uploaded file
   */
  async uploadFile(
    req: Request,
    i18n: I18nContext,
  ): Promise<IUploadedFile> {
    return new Promise((resolve, reject) => {
      const busboy = Busboy({
        headers: req.headers,
        limits: {
          fileSize: this.fileSizeLimit,
        },
      });
      let uploadPromise: Promise<IUploadedFile> | null = null;
      let hasFile = false;

      busboy.on('file', async (_fieldname, fileStream, fileInfo) => {
        hasFile = true;

        const sanitizedFilename = this.sanitizeFilename(
          Buffer.from(fileInfo.filename, 'latin1').toString('utf8')
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

      busboy.on('finish', async () => {
        try {
          if (!hasFile) {
            reject(new BadRequestException(i18n.service.t('message.storage.notFindFile')));
            return;
          }

          if (uploadPromise) {
            uploadPromise.then(resolve).catch(reject);
          } else {
            reject(new BadRequestException(i18n.service.t('message.storage.uploadFail')));
          }
        }
        catch(error) {
          reject(error);
        }
      });
      busboy.on('error', error => reject(error));

      req.pipe(busboy);

      req.on('close', () => busboy.destroy());
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
    const key = this.generateKey();
    const type = this.detectType(file.filename, i18n, file.mimeType);

    let size = 0;
    let inputStream = file.stream;
    inputStream.on("data", chunk => {
      size += chunk.length;
    });

    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.bucketName,
        Key: key,
        Body: inputStream,
        ContentType: file.mimeType,
      }
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
      for (const [ type, expectedMime ] of Object.entries(this.MIME_TYPES)) {
        if (mimeType === expectedMime) {
          return type as FileType;
        }
      }
    }

    const extension = filename.split('.').pop()?.toLowerCase() || '';
    for (const [ type, extensions ] of Object.entries(this.ALLOWED_EXTENSIONS)) {
      if (extensions.includes(extension)) {
        return type as FileType;
      }
    }

    throw new BadRequestException(i18n.service.t('message.storage.unsupportedType'));
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
    return filename
      .replace(/[^\w\d\u0400-\u04FF.-]/g, '_') // Enable cyrillic symbols
      .substring(0, 255); // LIMIT filename length
  }

  /**
   * Ensure bucket exists in S3
   * @param bucketName Name of bucket
   */
  private async ensureBucketExists(bucketName: string) {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    }
    catch(error: any) {
      if(error?.name === "NotFound") {
        await this.s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
      }
      else {
        throw new Error(`Failed to ensure bucket exists:\n\n${JSON.stringify(error)}\n`);
      }
    }
  }
}
