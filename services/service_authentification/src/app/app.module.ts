import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from "nestjs-i18n";
import * as path from "path";
import { AuthentificationModule } from "src/authentification/authentification.module";
import configuration from "src/config/config.factory";
import { CryptModule } from "src/crypt/crypt.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    I18nModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        fallbackLanguage: config.get<string>("defaultLanguage") || "en",
        loaderOptions: {
          path: path.join(__dirname, "../i18n/"),
          watch: true,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ["lang"] },
        AcceptLanguageResolver,
        new HeaderResolver(["x-lang"]),
      ],
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>("database.uri"),
      }),
      inject: [ConfigService],
    }),
    CryptModule,
    AuthentificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
