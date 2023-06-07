import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {RabbitMQModule} from "@golevelup/nestjs-rabbitmq";
import {getRmqConfig} from "@app/common";


@Module({
  imports: [
    // RabbitMQModule.forRoot(RabbitMQModule, getRmqConfig('auth', 'topic')),
    // RabbitMQModule.forRootWithConfig('auth', 'topic')
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'auth',
          type: 'topic',
        },
      ],
      uri: 'amqp://rmq',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
