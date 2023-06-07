import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {ConfigService} from "@nestjs/config";
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false
  });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const configService = app.get<ConfigService>(ConfigService);

  const PORT = configService.get<string>('PORT') || 5000;
  await app.listen(PORT);

  const logger = new Logger('Bootstrap');
  logger.log(`Application started on port ${PORT}...`);
}
bootstrap();
