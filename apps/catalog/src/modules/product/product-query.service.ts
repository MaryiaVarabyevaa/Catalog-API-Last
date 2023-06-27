import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { winstonLoggerConfig } from '@app/common';
import { Product } from './entities';
import { FindProductByIdData } from './types';

@Injectable()
export class ProductQueryService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAllProducts(): Promise<Product[]> {
    winstonLoggerConfig.info(`Finding all products`);

    const products = await this.productRepository.find();

    winstonLoggerConfig.info(`Found ${products.length} products`);
    return products;
  }

  async findProductById({ id }: FindProductByIdData): Promise<Product> {
    winstonLoggerConfig.info(`Finding product with id ${id}`);

    const product = await this.productRepository.findOne({ where: { id } });

    winstonLoggerConfig.info(
      `Found product with id ${id}: ${JSON.stringify(product)}`,
    );

    return product;
  }
}
