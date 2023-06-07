import {Inject, Injectable, LoggerService} from '@nestjs/common';
import {WINSTON_MODULE_NEST_PROVIDER} from "nest-winston";
import {AmqpConnection} from "@golevelup/nestjs-rabbitmq";

@Injectable()
export class CartService {

    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
        private readonly amqpConnection: AmqpConnection,
    ) {}

    async addProduct() {
        await this.sendMessage('cart', 'cart-route', {})
    }

    private async sendMessage(
        exchange: string,
        routingKey: string,
        data: any,
    ) {
        await this.amqpConnection.publish(exchange, routingKey, { data });
    }
}
