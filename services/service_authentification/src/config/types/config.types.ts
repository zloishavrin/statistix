export interface IConfig {
  port: number;
  database: {
    uri: string;
  };
  crypt: {
    encryptSecret: string;
    hashSecret: string;
  };
  jwt: {
    refreshExpires: string;
    refreshSecret: string;
    accessExpires: string;
    accessSecret: string;
  };
  registrationEnabled: boolean;
  defaultLanguage: string;
  isProduction: boolean;
}
