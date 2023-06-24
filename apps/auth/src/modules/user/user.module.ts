import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RmqModule, RmqService } from '@app/common';
import { UserService } from './user.service';
import { User } from './entities';

@Module({
  imports: [RmqModule, TypeOrmModule.forFeature([User])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
