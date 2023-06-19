import { Injectable } from '@nestjs/common';
import {RabbitRPC, RabbitSubscribe} from '@golevelup/nestjs-rabbitmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities';
import { Repository } from 'typeorm';
import { exchange, Queue, RoutingKey } from './constants';
import {FindProductById} from "./types";
import {resolveObjMapThunk} from "graphql/type";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  @RabbitRPC({
    exchange,
    routingKey: RoutingKey.FIND_ALL_PRODUCTS,
    queue: Queue.FIND_ALL_PRODUCTS,
  })
  async handleFindAllProducts(msg: any) {
    const res = await this.productRepository.find();
    console.log(res);
    console.log('find all products route');
  }

  @RabbitRPC({
    exchange,
    routingKey: RoutingKey.FIND_PRODUCT_BY_ID,
    queue: Queue.FIND_PRODUCT_BY_ID,
  })
  async handleFindProductById({ id }: FindProductById) {
    const product = await this.productRepository.findOne({ where: { id } });
    return product;
  }

  @RabbitRPC({
    exchange,
    routingKey: RoutingKey.PRODUCT_CREATED,
    queue: Queue.PRODUCT_CREATED,
  })
  async handleCreateProduct(msg: any) {
    console.log(msg)
   return true;
  }

  @RabbitRPC({
    exchange,
    routingKey: RoutingKey.PRODUCT_UPDATED,
    queue: Queue.PRODUCT_UPDATED,
  })
  async handleUpdatedProduct(msg: any) {
    console.log(msg)
    return true;
  }

  @RabbitRPC({
    exchange,
    routingKey: RoutingKey.PRODUCT_DELETED,
    queue: Queue.PRODUCT_DELETED
  })
  async handleDeletedProduct(msg: any) {
    console.log(msg)
    return true;
  }
}
