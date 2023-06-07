import { Injectable } from '@nestjs/common';
import {RabbitSubscribe} from "@golevelup/nestjs-rabbitmq";

@Injectable()
export class CartService {

    @RabbitSubscribe({
        exchange: 'cart',
        routingKey: 'cart-route',
        queue: 'cart-route',
    })
    public async handleAddProduct(msg: any) {
        console.log('add product to the shopping cart');
    }
}
