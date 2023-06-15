import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Details, Order } from './entities';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'order',
          type: 'topic',
        },
      ],
      uri: 'amqp://127.0.0.1',
      // uri: 'amqp://rmq',
    }),
    TypeOrmModule.forFeature([Order, Details]),
    StripeModule,
  ],
  providers: [OrderService],
})
export class OrderModule {}
