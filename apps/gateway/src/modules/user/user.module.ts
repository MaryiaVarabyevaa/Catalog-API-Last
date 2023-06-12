import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import {RabbitMQModule} from "@golevelup/nestjs-rabbitmq";
import {SessionModule} from "../../../../auth/src/modules/session/session.module";

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'auth',
          type: 'topic',
        },
      ],
      uri: 'amqp://127.0.0.1',
      // uri: 'amqp://rmq',
    }),
  ],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
