import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AtStrategy, LocalAuthStrategy, RtStrategy } from './strategies';
import { SessionSerializer } from './utils';
import { JwtModule } from '@nestjs/jwt';
import { RmqModule } from '@app/common';
import { AUTH_SERVICE } from './constants';

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
    PassportModule.register({
      session: true,
    }),
    JwtModule.register({}),
    UserModule,
    PassportModule,
  ],
  providers: [
    AuthService,
    AuthResolver,
    LocalAuthStrategy,
    SessionSerializer,
    AtStrategy,
    RtStrategy,
  ],
})
export class AuthModule {}
