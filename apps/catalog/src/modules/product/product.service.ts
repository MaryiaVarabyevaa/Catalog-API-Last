import { Injectable } from '@nestjs/common';
import {RabbitSubscribe} from "@golevelup/nestjs-rabbitmq";

@Injectable()
export class CatalogService {

    @RabbitSubscribe({
        exchange: 'catalog',
        routingKey: 'catalog-route',
        queue: 'catalog-queue',
    })
    public async handleGetProducts(msg: any) {
        console.log('get all products');
    }
}
