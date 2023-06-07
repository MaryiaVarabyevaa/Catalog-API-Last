import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import {RabbitMQModule} from "@golevelup/nestjs-rabbitmq";

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'catalog',
          type: 'topic',
        },
      ],
      uri: 'amqp://rmq',
    }),
  ],
  providers: [CatalogService],
  controllers: [CatalogController]
})
export class CatalogModule {}
