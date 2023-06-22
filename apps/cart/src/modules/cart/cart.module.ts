import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RmqModule } from '@app/common';
import { CartService } from './cart.service';
import { Cart, Details } from './entities';
import { CartController } from './cart.controller';

@Module({
  imports: [RmqModule, TypeOrmModule.forFeature([Cart, Details])],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
