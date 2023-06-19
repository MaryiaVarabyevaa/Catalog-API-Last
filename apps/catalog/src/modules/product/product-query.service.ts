import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities';
import { Repository } from 'typeorm';
import { FindProductByIdData } from './types';

@Injectable()
export class ProductQueryService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAllProducts(
    page: number = 1,
    pageSize: number = 10,
    sortField: string = 'name',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    filter: any = {},
  ) {
    const query = this.productRepository
      .createQueryBuilder('product')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy(sortField, sortOrder);

    Object.keys(filter).forEach((key) => {
      query.andWhere(`product.${key} LIKE :${key}`, {
        [key]: `%${filter[key]}%`,
      });
    });

    const products = await query.getManyAndCount();

    return products;
  }

  async findProductById({ id }: FindProductByIdData): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    return product;
  }
}
