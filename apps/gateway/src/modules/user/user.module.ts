import { Module } from '@nestjs/common';
import { RmqModule } from '@app/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { UserService } from './user.service';
import { AUTH_SERVICE } from './constants';
import { UserResolver } from './user.resolver';

@Module({
  imports: [
    RmqModule.register({
      name: AUTH_SERVICE,
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: true,
      context: ({ req, res }) => ({ req, res }),
    }),
  ],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
