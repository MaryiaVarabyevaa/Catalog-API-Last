import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {RabbitMQModule} from "@golevelup/nestjs-rabbitmq";
// import {RabbitMQModule} from "@app/common";

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'auth',
          type: 'topic',
        },
      ],
      // uri: 'amqp://127.0.0.1',
      uri: 'amqp://rmq',
    }),
    // RabbitMQModule.forRootWithConfig('auth', 'topic')
  ],
  providers: [AuthService]
})
export class AuthModule {}
