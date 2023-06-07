import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
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
  providers: [CartService],
  controllers: [CartController]
})
export class CartModule {}
