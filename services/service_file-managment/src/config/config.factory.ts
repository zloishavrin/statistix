import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import type { IConfig } from './types/config.types';

export default (): IConfig => {
  const loadConfiguration = (
    key: string,
    defaultValue: string,
    isSecret?: boolean,
  ): string => {
    const fileEnvVar = `${key}_FILE`;
    const filePath = process.env[fileEnvVar];
    if (filePath) {
      const localPath = join(__dirname, filePath);

      if (existsSync(filePath)) {
        const valueData = readFileSync(filePath, 'utf-8');
        const value = valueData.trim();
        const logValue = isSecret ? '*'.repeat(value.length) : value;
        console.info(`[i] VARIABLE ${key}: ${logValue}`);
        return value;
      } else if (existsSync(localPath)) {
        const valueData = readFileSync(localPath, 'utf-8');
        const value = valueData.trim();
        const logValue = isSecret ? '*'.repeat(value.length) : value;
        console.info(`[i] VARIABLE ${key}: ${logValue}`);
        return value;
      }
    }

    const value = process.env[key];
    if (value) {
      const logValue = isSecret ? '*'.repeat(value.length) : value;
      console.info(`[i] VARIABLE ${key}: ${logValue}`);
      return value;
    } else {
      console.info(`[i] VARIABLE ${key}: [DEFAULT]`);
      return defaultValue;
    }
  };

  const config: IConfig = {
    port: Number(loadConfiguration('PORT', '3002', false)),
    database: {
      uri: loadConfiguration(
        'DB_URI',
        'mongodb://root:password@mongodb:27017/statistix?authSource=admin',
        true,
      ),
    },
    s3: {
      uri: loadConfiguration('S3_URI', 'http://minio:9000', false),
      accessKeyId: loadConfiguration('S3_ACCESS_KEY_ID', 'admin', true),
      secretAccessKey: loadConfiguration(
        'S3_SECRET_ACCESS_KEY',
        'admin_secret',
        true,
      ),
      region: loadConfiguration('S3_REGION', 'ru-central-1', false),
      bucket: loadConfiguration('S3_BUCKET', 'statistix', false),
    },
    limits: {
      fileSize: Number(loadConfiguration('FILE_SIZE_LIMIT', '500', false)),
    },
    defaultLanguage: loadConfiguration('LANGUAGE', 'EN', false),
    isProduction: process.env.NODE_ENV === 'production',
  };

  return config;
};
