import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities';
import {FindProductByIdData} from "./types";

@Injectable()
export class ProductQueryService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAllProducts(): Promise<Product[]> {
    const products = await this.productRepository.find();
    return products;
  }

  async findProductById({ id }: FindProductByIdData): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    return product;
  }
}
