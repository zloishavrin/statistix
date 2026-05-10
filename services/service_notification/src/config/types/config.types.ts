export interface IConfig {
  port: number;
  rabbitmq: {
    user: string;
    password: string;
  };
  jwt: {
    secret: string;
  };
  isProduction: boolean;
}
