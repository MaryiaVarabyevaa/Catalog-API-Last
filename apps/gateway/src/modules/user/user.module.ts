import { Module } from '@nestjs/common';
import { RmqModule } from '@app/common';
import { UserService } from './user.service';
import { AUTH_SERVICE } from './constants';
import { UserResolver } from './user.resolver';

@Module({
  imports: [
    RmqModule.register({
      name: AUTH_SERVICE,
    }),
  ],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
