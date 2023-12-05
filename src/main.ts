import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cors from 'cors';
import helmet from 'helmet';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:8080',
    credentials: true,
  });

  const options = new DocumentBuilder()
    .setTitle('Task API')
    .setTitle('Task API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}

bootstrap();
