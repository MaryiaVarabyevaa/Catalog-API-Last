import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './modules/order/order.module';
import { CartModule } from './modules/cart/cart.module';
import { UserModule } from './modules/user/user.module';
import { CatalogModule } from './modules/catalog/catalog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/gateway/.env',
    }),
    AuthModule,
    OrderModule,
    CatalogModule,
    CartModule,
    UserModule,
  ],
})
export class AppModule {}
