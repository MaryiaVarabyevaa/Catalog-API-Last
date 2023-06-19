import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { OrderResolver } from './order.resolver';
import { RmqModule } from '@app/common';
import { ORDER_SERVICE } from './constants';

@Module({
  imports: [
    RmqModule.register({
      name: ORDER_SERVICE,
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: true,
      context: ({ req, res }) => ({ req, res }),
    }),
  ],
  providers: [OrderResolver, OrderService],
})
export class OrderModule {}
