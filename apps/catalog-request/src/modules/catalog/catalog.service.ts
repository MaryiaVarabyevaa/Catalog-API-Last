import { Injectable } from '@nestjs/common';
import {RabbitSubscribe} from "@golevelup/nestjs-rabbitmq";

@Injectable()
export class CatalogService {
    @RabbitSubscribe({
        exchange: 'catalog',
        routingKey: 'add-product-route',
        queue: 'catalog-queue',
    })
    public async handleAddProduct(msg: any) {
        console.log('add new product to the catalog');
    }
}
