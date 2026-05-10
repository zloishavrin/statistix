import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

import { AppModule } from './app/app.module';

import type { OpenAPIObject } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const fileSizeLimit = configService.getOrThrow<number>('limits.fileSize');
  app.use(express.json({ limit: `${fileSizeLimit}mb` }));
  app.use(express.urlencoded({ limit: `${fileSizeLimit}mb`, extended: true }));

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
    .setTitle('STATSTIX | File Managment')
    .setDescription('Description of the File Managment service API')
    .setVersion('1.0')
    .build();

  const documentFactory = (): OpenAPIObject =>
    SwaggerModule.createDocument(app, SwaggerConfig);
  SwaggerModule.setup('/api/file-managment/docs', app, documentFactory);

  const port = configService.getOrThrow<number>('port');
  await app.listen(port);
}
bootstrap();
