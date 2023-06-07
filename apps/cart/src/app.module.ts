import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {CartModule} from "./modules/cart/cart.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/cart/.env',
    }),
      CartModule
  ],

})
export class AppModule {}
