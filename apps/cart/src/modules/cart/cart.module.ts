import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import {RabbitMQModule} from "@golevelup/nestjs-rabbitmq";

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'cart',
          type: 'topic',
        },
      ],
      uri: 'amqp://rmq',
    }),
  ],
  providers: [CartService]
})
export class CartModule {}
