import { existsSync, readFileSync } from "fs";
import { join } from "path";

import type { IConfig } from "./types/config.types";

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
        const valueData = readFileSync(filePath, "utf-8");
        const value = valueData.trim();
        const logValue = isSecret ? "*".repeat(value.length) : value;
        console.info(`[i] VARIABLE ${key}: ${logValue}`);
        return value;
      } else if (existsSync(localPath)) {
        const valueData = readFileSync(localPath, "utf-8");
        const value = valueData.trim();
        const logValue = isSecret ? "*".repeat(value.length) : value;
        console.info(`[i] VARIABLE ${key}: ${logValue}`);
        return value;
      }
    }

    const value = process.env[key];
    if (value) {
      const logValue = isSecret ? "*".repeat(value.length) : value;
      console.info(`[i] VARIABLE ${key}: ${logValue}`);
      return value;
    } else {
      console.info(`[i] VARIABLE ${key}: [DEFAULT]`);
      return defaultValue;
    }
  };

  const config: IConfig = {
    port: Number(loadConfiguration("PORT", "3001", false)),
    database: {
      uri: loadConfiguration(
        "DB_URI",
        "mongodb://root:password@mongodb:27017/statistix?authSource=admin",
        true,
      ),
    },
    crypt: {
      encryptSecret: loadConfiguration(
        "ENCRYPT_SECRET",
        "encrypt-secret",
        true,
      ),
      hashSecret: loadConfiguration("HASH_SECRET", "hash-secret", true),
    },
    jwt: {
      refreshExpires: loadConfiguration("JWT_EXPIRES_REFRESH", "30d", false),
      refreshSecret: loadConfiguration(
        "JWT_SECRET_REFRESH",
        "jwt-refresh",
        true,
      ),
      accessExpires: loadConfiguration("JWT_EXPIRES_ACCESS", "15m", false),
      accessSecret: loadConfiguration("JWT_SECRET_ACCESS", "jwt-access", true),
    },
    defaultLanguage: loadConfiguration("LANGUAGE", "EN", false),
    registrationEnabled:
      loadConfiguration("REGISTRATION_ENABLED", "false", false) === "true",
    isProduction: process.env.NODE_ENV === "production",
  };

  return config;
};
