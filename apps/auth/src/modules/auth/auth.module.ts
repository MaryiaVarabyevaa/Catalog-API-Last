import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {RabbitMQModule} from "@golevelup/nestjs-rabbitmq";
import {UserModule} from "../user/user.module";
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloDriver} from "@nestjs/apollo";
import {TokenModule} from "../token/token.module";
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
      uri: 'amqp://127.0.0.1',
      // uri: 'amqp://rmq',
    }),
    UserModule,
    TokenModule
  ],
  providers: [AuthService]
})
export class AuthModule {}
