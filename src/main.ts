import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(express.json({ limit: '10mb' }));
  app.disable('x-powered-by');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(helmet());
  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('AgricMe API')
    .setDescription('AgriTech App API Documentation')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addServer('https://agricme-be.onrender.com')
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/docs', app, swaggerDoc);

  const configService = app.get(ConfigService);
  const port = configService.get('port');
  await app.listen(port);
  console.info(`Server is running on port ${port}`)
}
bootstrap();