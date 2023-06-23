import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RmqModule } from '@app/common';
import { OrderService } from './order.service';
import { Details, Order } from './entities';
import { StripeModule } from '../stripe/stripe.module';
import { CART_SERVICE, CATALOG_REQUEST_SERVICE } from './constants';
import { OrderController } from './order.controller';
import { SendMessageToCartHelper, SendMessageToCatalogHelper } from './helpers';

@Module({
  imports: [
    RmqModule.register({
      name: CATALOG_REQUEST_SERVICE,
    }),
    RmqModule.register({
      name: CART_SERVICE,
    }),
    TypeOrmModule.forFeature([Order, Details]),
    StripeModule,
  ],
  providers: [
    OrderService,
    SendMessageToCartHelper,
    SendMessageToCatalogHelper,
  ],
  controllers: [OrderController],
})
export class OrderModule {}
