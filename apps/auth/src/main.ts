import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import {WINSTON_MODULE_NEST_PROVIDER} from "nest-winston";
import {Logger} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        logger: false
      }
  );

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  await app.init();

  const logger = new Logger('Bootstrap');
  logger.log(`Auth microservice started working`);
}
bootstrap();
