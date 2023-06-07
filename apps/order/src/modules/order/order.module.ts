import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import {RabbitMQModule} from "@golevelup/nestjs-rabbitmq";

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'order',
          type: 'topic',
        },
      ],
      // uri: 'amqp://127.0.0.1',
      uri: 'amqp://rmq',
    }),
  ],
  providers: [OrderService]
})
export class OrderModule {}
