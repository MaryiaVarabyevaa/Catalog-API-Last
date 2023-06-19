import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { RmqModule } from '@app/common';
import { AUTH_SERVICE } from './constants';

@Module({
  imports: [
    RmqModule.register({
      name: AUTH_SERVICE,
    }),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
