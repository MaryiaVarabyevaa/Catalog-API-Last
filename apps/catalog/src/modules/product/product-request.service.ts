import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities';
import { Repository } from 'typeorm';
import {
  CreateProductData,
  DeleteProductData,
  UpdateProductData,
  UpdateQuantityData,
} from './types';
import { RpcException } from '@nestjs/microservices';
import { ErrorMessages } from './constants';

@Injectable()
export class ProductRequestService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createProduct(product: CreateProductData): Promise<void> {

    // throw new RpcException('');

    const isExistedProduct = await this.productRepository.findOne({
      where: { name: product.name },
    });

    if (isExistedProduct) {
      throw new RpcException(ErrorMessages.CONFLICT);
    }

    const newProduct = await this.productRepository.create({
      ...product,
      availableQuantity: product.totalQuantity,
    });

    await this.productRepository.save(newProduct);
  }

  async updatedProduct({ id, ...rest }: UpdateProductData): Promise<void> {
    await this.checkProductExistence(id);
    await this.productRepository.update(id, {
      ...rest,
      availableQuantity: rest.totalQuantity,
    });
  }

  async deletedProduct({ id }: DeleteProductData): Promise<void> {
    await this.checkProductExistence(id);
    await this.productRepository.delete(id);
  }

  async updateQuantityProduct({
    id,
    rightQuantity,
  }: UpdateQuantityData): Promise<void> {
    await this.checkProductExistence(id);

    const { availableQuantity } = await this.productRepository.findOne({
      where: { id },
    });

    if (availableQuantity >= rightQuantity) {
      await this.productRepository.update(id, {
        availableQuantity: availableQuantity - rightQuantity,
      });
    } else {
      throw new RpcException(ErrorMessages.BAD_REQUEST);
    }
  }

  private async checkProductExistence(id: number): Promise<void> {
    const isExistedProduct = await this.productRepository.findOne({
      where: { id },
    });

    if (!isExistedProduct) {
      throw new RpcException(ErrorMessages.NOT_FOUND);
    }
  }
}
