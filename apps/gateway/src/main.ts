import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  app.use(cookieParser());

  app.use(
    session({
      name: 'SESSION_ID',
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000,
        secure: true,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
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
