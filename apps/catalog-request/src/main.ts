import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const rmqService = app.get<RmqService>(RmqService);
  // app.connectMicroservice(rmqService.getOptions('CATALOG'));
  app.connectMicroservice(rmqService.getOptions('CATALOG_REQUEST'));
  await app.startAllMicroservices();
}
bootstrap();
