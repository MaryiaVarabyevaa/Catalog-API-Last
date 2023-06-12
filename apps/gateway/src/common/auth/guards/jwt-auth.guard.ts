import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {catchError, map, Observable, throwError} from "rxjs";
import {AmqpConnection} from "@golevelup/nestjs-rabbitmq";
import {ErrorMessage, exchange, RoutingKey} from "@app/common/auth/constants";
import {GqlExecutionContext} from "@nestjs/graphql";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly amqpConnection: AmqpConnection,
    ) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const accessToken = this.getAuthentication(context);
        return this.sendMessageWithResponse(RoutingKey.VALIDATE_USER, { accessToken })
            .then((res) => {
                this.addUser(res, context);
                return true;
            })
            .catch(() => {
                throw new UnauthorizedException();
            })
    }

    private getAuthentication(context: ExecutionContext): string {
        const { req } = GqlExecutionContext.create(context).getContext();
        const { accessToken } = req.cookies;
        if (!accessToken) {
            throw new UnauthorizedException(
                ErrorMessage.UNAUTHORIZED
            );
        }
        return accessToken;
    }


    private addUser(user: any, context: ExecutionContext): void {
        if (context.getType() === 'rpc') {
            context.switchToRpc().getData().user = user;
        } else if (context.getType() === 'http') {
            context.switchToHttp().getRequest().user = user;
        }
    }


    private async sendMessageWithResponse(
        routingKey: RoutingKey,
        data: any,
    ) {
        return await this.amqpConnection.request({
            exchange,
            routingKey,
            payload: { data }
        })
    }
}