import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { RmqModule } from '@app/common';
import { CART_SERVICE } from './constants';

@Module({
  imports: [
    RmqModule.register({
      name: CART_SERVICE,
    }),
  ],
  providers: [CartService],
})
export class CartModule {}
