import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { I18nValidationExceptionFilter, I18nValidationPipe } from "nestjs-i18n";

import { AppModule } from "./app/app.module";

import type { OpenAPIObject } from "@nestjs/swagger";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("/api/auth");

  app.enableCors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST"],
  });

  app.useGlobalPipes(
    new I18nValidationPipe(),
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  app.useGlobalFilters(new I18nValidationExceptionFilter());

  const SwaggerConfig = new DocumentBuilder()
    .setTitle("STATSTIX | Authentification")
    .setDescription("Description of the Authentication service API")
    .setVersion("1.0")
    .build();

  const documentFactory = (): OpenAPIObject =>
    SwaggerModule.createDocument(app, SwaggerConfig);
  SwaggerModule.setup("/api/auth/docs", app, documentFactory);

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
