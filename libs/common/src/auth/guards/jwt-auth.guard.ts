import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ErrorMessage, exchange, RoutingKey } from '../constants';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const accessToken = this.getAuthentication(context);
    return this.sendMessageWithResponse(RoutingKey.VALIDATE_USER, {
      accessToken,
    })
      .then((res) => {
        this.addUser(res, context);
        return true;
      })
      .catch(() => {
        throw new UnauthorizedException();
      });
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  private getAuthentication(context: ExecutionContext): string {
    const req = this.getRequest(context);
    const { at } = req.cookies;
    if (!at) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }
    return at;
  }

  private addUser(user: any, context: ExecutionContext): void {
    if (context.getType() === 'rpc') {
      context.switchToRpc().getData().user = user;
    } else if (context.getType() === 'http') {
      context.switchToHttp().getRequest().user = user;
    }
  }

  private async sendMessageWithResponse(routingKey: RoutingKey, data: any) {
    return await this.amqpConnection.request({
      exchange,
      routingKey,
      payload: { data },
    });
  }
}
