import { Module } from '@nestjs/common';
import { RmqModule } from '@app/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { TokenModule } from '../token/token.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [RmqModule, UserModule, TokenModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
