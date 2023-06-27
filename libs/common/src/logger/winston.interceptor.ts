import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { winstonLoggerConfig } from './winston.config';
import { Observable, tap } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const operation = ctx.getInfo().operation.operation;
    const operationName = ctx.getInfo().fieldName;
    const { originalUrl } = req;
    const start = Date.now();

    winstonLoggerConfig.info(
      `Input: ${operation}.${operationName} ${originalUrl}`,
    );

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - start;
        winstonLoggerConfig.info(
          `Output: ${operation}.${operationName} ${originalUrl} - ${duration}ms`,
        );
      }),
    );
  }
}
