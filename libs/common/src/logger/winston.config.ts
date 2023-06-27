import { createLogger, format, transports } from 'winston';

export const winstonLoggerConfig = createLogger({
  format: format.combine(
    format.colorize({
      all: true,
      colors: { info: 'green', warn: 'yellow', error: 'red' },
    }),
    format.timestamp(),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  transports: [new transports.Console()],
});
