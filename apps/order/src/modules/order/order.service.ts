import { Injectable } from '@nestjs/common';
import {RabbitSubscribe} from "@golevelup/nestjs-rabbitmq";

@Injectable()
export class OrderService {
    @RabbitSubscribe({
        exchange: 'order',
        routingKey: 'order-route',
        queue: 'order-route',
    })
    public async handlePayOrder(msg: any) {
        console.log('pay order');
    }
}
