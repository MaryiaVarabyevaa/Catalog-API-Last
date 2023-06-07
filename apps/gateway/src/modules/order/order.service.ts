import {Inject, Injectable, LoggerService} from '@nestjs/common';
import {WINSTON_MODULE_NEST_PROVIDER} from "nest-winston";
import {AmqpConnection} from "@golevelup/nestjs-rabbitmq";

@Injectable()
export class OrderService {

    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
        private readonly amqpConnection: AmqpConnection,
    ) {}

    async payOrder() {
        await this.sendMessage('order', 'order-route', {})
    }

    private async sendMessage(
        exchange: string,
        routingKey: string,
        data: any,
    ) {
        await this.amqpConnection.publish(exchange, routingKey, { data });
    }
}
