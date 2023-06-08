import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import {RabbitMQModule} from "@golevelup/nestjs-rabbitmq";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Product} from "./entities";

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'catalog',
          type: 'topic',
        },
      ],
      // uri: 'amqp://127.0.0.1',
      uri: 'amqp://rmq',
    }),
    TypeOrmModule.forFeature([ Product ])
  ],
  providers: [CatalogService]
})
export class CatalogModule {}
