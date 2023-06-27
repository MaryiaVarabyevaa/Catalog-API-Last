import {CallHandler, ExecutionContext, Injectable, NestInterceptor, NestMiddleware} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { winstonLogger } from './winston.config';
import {Observable, tap} from "rxjs";
import {GqlExecutionContext} from "@nestjs/graphql";

// @Injectable()
// export class LoggingMiddleware implements NestMiddleware {
//     use(req: Request, res: Response, next: NextFunction) {
//         const { method, originalUrl } = req;
//         const start = Date.now();
//
//         res.on('finish', () => {
//             const duration = Date.now() - start;
//             winstonLogger.info(
//                 `${method} ${originalUrl} ${res.statusCode} - ${duration}ms`,
//             );
//         });
//
//         next();
//     }
// }
//
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = GqlExecutionContext.create(context);
        const { req } = ctx.getContext();
        const operation = ctx.getInfo().operation.operation;
        const operationName = ctx.getInfo().fieldName;
        const handler = context.getHandler();
        const handlerName = handler.constructor.name;
        const { originalUrl } = req;
        const start = Date.now();

        return next
            .handle()
            .pipe(
                tap(() => {
                    const duration = Date.now() - start;
                    winstonLogger.info(
                        `${operation}.${operationName} ${originalUrl} - ${duration}ms`,
                    );
                }),
            );
    }
}

