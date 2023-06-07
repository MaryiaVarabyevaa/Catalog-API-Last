import { transports, format } from 'winston';
import { WinstonModuleOptions } from 'nest-winston';

export const winstonConfig: WinstonModuleOptions = {
    transports: [
        new transports.Console({
            format: format.combine(
                format.timestamp(),
                format.colorize(),
                format.printf(({ level, message, timestamp }) => {
                    return `${timestamp} [${level.toUpperCase()}] - ${message}`;
                }),
            ),
        }),
    ],
};
