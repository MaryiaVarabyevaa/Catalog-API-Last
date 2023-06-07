import { Module } from '@nestjs/common';
import {OrderModule} from "./modules/order/order.module";
import {ConfigModule} from "@nestjs/config";


@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: './apps/order/.env',
      }),
      OrderModule
  ],

})
export class AppModule {}
