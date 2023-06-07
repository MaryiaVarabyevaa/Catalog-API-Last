import {Module} from '@nestjs/common';
import {AuthModule} from "./modules/auth/auth.module";
import {ConfigModule} from "@nestjs/config";
import {WinstonModule} from 'nest-winston';
import {winstonConfig} from "@app/common";
import {OrderModule} from "./modules/order/order.module";
import {CatalogModule} from "./modules/catalog/catalog.module";
import {CartModule} from "./modules/cart/cart.module";

@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: './apps/gateway/.env',
      }),
      WinstonModule.forRoot(winstonConfig),
      AuthModule,
      OrderModule,
      CatalogModule,
      CartModule
  ],
})
export class AppModule {}
