import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RmqModule } from '@app/common';
import { UserService } from './user.service';
import { User } from './entities';
import { TokenModule } from '../token/token.module';
import {UserController} from "./user.controller";

@Module({
  imports: [RmqModule, TypeOrmModule.forFeature([User]), TokenModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
