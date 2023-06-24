import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { RmqModule } from '@app/common';
import { CART_SERVICE } from './constants';
import { CartResolver } from './cart.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    RmqModule.register({
      name: CART_SERVICE,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: true,
      context: ({ req, res }) => ({ req, res }),
    }),
  ],
  providers: [CartService, CartResolver],
})
export class CartModule {}
