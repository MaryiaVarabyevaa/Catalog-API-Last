import {Module} from '@nestjs/common';
import {UserService} from "./user.service";
import {RabbitMQModule} from "@golevelup/nestjs-rabbitmq";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities";


@Module({
  imports: [
      // MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      RabbitMQModule.forRoot(RabbitMQModule, {
          exchanges: [
              {
                  name: 'auth',
                  type: 'topic',
              },
          ],
          uri: 'amqp://127.0.0.1',
          // uri: 'amqp://rmq',
      }),
      TypeOrmModule.forFeature([ User ])
  ],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
