import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');

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
    .setTitle('STATSTIX | Task')
    .setDescription('Description of the Task service API')
    .setVersion('1.0')
    .build();

  const documentFactory = (): OpenAPIObject =>
    SwaggerModule.createDocument(app, SwaggerConfig);
  SwaggerModule.setup('/api/task/docs', app, documentFactory);

  const port = configService.getOrThrow<number>('port');
  await app.listen(port);
}
bootstrap();
