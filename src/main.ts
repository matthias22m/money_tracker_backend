import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Configure Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Money Tracker API')
    .setDescription('Personal finance tracking API with social features')
    .setVersion('1.0.0')
    .addTag('transactions', 'Income and expense transactions')
    .addTag('budgets', 'Monthly budgets')
    .addTag('categories', 'Transaction categories')
    .addTag('users', 'User management')
    .addTag('friends', 'Social features and friend requests')
    .addTag('loans', 'Shared expenses and loans')
    .addTag('notifications', 'In-app notifications')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`Swagger documentation: http://localhost:${process.env.PORT ?? 3000}/api/docs`);
}
bootstrap();
