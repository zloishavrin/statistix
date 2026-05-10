export interface IConfig {
  port: number;
  database: {
    uri: string;
  };
  s3: {
    uri: string;
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucket: string;
  };
  limits: {
    fileSize: number;
  };
  defaultLanguage: string;
  isProduction: boolean;
}
