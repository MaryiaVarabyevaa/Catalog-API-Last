import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {RabbitMQModule} from "@golevelup/nestjs-rabbitmq";
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloDriver} from "@nestjs/apollo";
import {AuthResolver} from "./auth.resolver";


@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'auth',
          type: 'topic',
        },
      ],
      uri: 'amqp://rmq',
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: true
    }),
  ],
  providers: [AuthService, AuthResolver]
})
export class AuthModule {}
