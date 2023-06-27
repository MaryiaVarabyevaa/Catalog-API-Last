import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RmqService, WinstonLogger } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  app.useLogger(new WinstonLogger());

  const rmqService = app.get<RmqService>(RmqService);

  app.connectMicroservice(rmqService.getOptions('CATALOG_REQUEST'));
  await app.startAllMicroservices();
}
bootstrap();
