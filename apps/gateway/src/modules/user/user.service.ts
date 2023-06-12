import {Inject, Injectable, LoggerService, UnauthorizedException} from '@nestjs/common';
import {AmqpConnection} from "@golevelup/nestjs-rabbitmq";
import {ErrorMessage, exchange, RoutingKey} from "./constants";
import {WINSTON_MODULE_NEST_PROVIDER} from "nest-winston";


@Injectable()
export class UserService {

    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
        private readonly amqpConnection: AmqpConnection,
    ) {}

    async validateUser(email: string, password: string) {
        this.logger.log(`Validate user with ${email} email`);
        const res = await this.sendMessage(RoutingKey.VALIDATE_USER,{ email, password });
        if (!res) {
            this.logger.error(`User entered an incorrect email or password`);
            throw new UnauthorizedException();
        }
        this.logger.log(`User with ${email} passed validation successfully`);
        return res;
    }

    private async sendMessage(
        routingKey: RoutingKey,
        data: any
    ) {
        return await this.amqpConnection.request({
            exchange,
            routingKey,
            payload: {data}
        });
    }
}
