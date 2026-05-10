export interface IConfig {
  port: number;
  database: {
    uri: string;
  };
  rabbitmq: {
    user: string;
    password: string;
  };
  configPath: string;
  defaultLanguage: string;
  isProduction: boolean;
}
