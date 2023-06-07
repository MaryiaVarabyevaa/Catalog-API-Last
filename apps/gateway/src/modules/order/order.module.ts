import { Module } from '@nestjs/common';
import {RabbitMQModule} from "@golevelup/nestjs-rabbitmq";
import {OrderService} from "./order.service";
import {OrderController} from "./order.controller";

@Module({
    imports: [
        RabbitMQModule.forRoot(RabbitMQModule, {
            exchanges: [
                {
                    name: 'order',
                    type: 'topic',
                },
            ],
            uri: 'amqp://rmq',
        }),
    ],
    providers: [OrderService],
    controllers: [OrderController]
})
export class OrderModule {}
