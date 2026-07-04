import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './shared/infrastructure/filters/all-exceptions.filter';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }
  ))

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.use(cookieParser());

  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://localhost:3000',

    ],
    credentials: true,
  });

  const configService = app.get(ConfigService);
  const accessTokenName = configService.get<string>('auth.accessTokenCookie');

  const config = new DocumentBuilder()
    .setTitle('Multitenant Task Manager API')
    .setDescription('API para la gestión de tareas')
    .setVersion('1.0')
    .addCookieAuth(accessTokenName)
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
