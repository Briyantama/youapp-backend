import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { NextFunction } from 'express';
// import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['*'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  });

  const config = new DocumentBuilder()
    .setTitle('YouApp API')
    .setDescription('API documentation for YouApp project')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Default: Bearer <your_token_here>',
      },
      'access-token',
    )
    .build();

  app.use((req: Request, res: Response, next: NextFunction) => {
    Logger.log('==== REQUEST ====');
    Logger.log(req.method, req.url);
    next();
  });

  // app.connectMicroservice({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: process.env.RABBITMQ_URI,
  //     queue: 'chat_queue',
  //     queueOptions: { durable: false },
  //   },
  // });

  await app.startAllMicroservices();
  Logger.log('✅ Microservice connected to RabbitMQ');

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(`🚀 Server running on http://localhost:${port}`);
  Logger.log(`📚 Swagger docs available at http://localhost:${port}/api-docs`);
}

void bootstrap();
