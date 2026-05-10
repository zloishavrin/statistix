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
    port: Number(loadConfiguration('PORT', '3004', false)),
    rabbitmq: {
      user: loadConfiguration('RABBIT_USER', 'user', false),
      password: loadConfiguration('RABBIT_PASSWORD', 'admin_secret', true),
    },
    jwt: {
      secret: loadConfiguration('JWT_SECRET_ACCESS', 'jwt-access', true),
    },
    isProduction: process.env.NODE_ENV === 'production',
  };

  return config;
};
