// import * as Sentry from '@sentry/node';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
// import { SentryExceptionFilter } from './sentry-exception.filter';
import './sentry.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // const sentryDsn = configService.get<string>('SENTRY_DSN');
  // Sentry.init({ dsn: sentryDsn });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL'),
    credentials: true,
  });

  // app.useGlobalFilters(new SentryExceptionFilter());
  app.setGlobalPrefix('api');
  await app.listen(3003);
}

bootstrap();
