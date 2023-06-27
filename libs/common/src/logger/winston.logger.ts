import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';

const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

@Injectable()
export class WinstonLogger implements LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      format: combine(
        format.colorize({
          all: true,
          colors: { info: 'green', warn: 'yellow', error: 'red' },
        }),
        label({ label: 'gatewayApi' }),
        timestamp(),
        myFormat,
      ),
      transports: [new transports.Console()],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(message, trace);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
