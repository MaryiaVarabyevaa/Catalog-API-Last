import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Product } from './entities';
import {
  CreateProductData,
  DeleteProductData,
  QuantityData,
  UpdateProductData,
  UpdateQuantityData,
} from './types';
import { ErrorMessages } from './constants';

@Injectable()
export class ProductRequestService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async createProduct(product: CreateProductData): Promise<void> {
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
    try {
      const product = await this.checkProductExistence(id);

      await this.cacheManager.set(`${id}-product`, JSON.stringify(product));

      await this.productRepository.update(id, {
        ...rest,
        availableQuantity: rest.totalQuantity,
      });
    } catch (err) {
      return err;
    }
  }

  async deletedProduct({ id }: DeleteProductData): Promise<void> {
    await this.checkProductExistence(id);
    await this.productRepository.softDelete(id);
  }

  async updateQuantityProduct({
    data,
    operation,
  }: UpdateQuantityData): Promise<void> {
    for (const { productId: id, rightQuantity } of data) {
      let value: number;
      const product = await this.checkProductExistence(id);
      await this.cacheManager.set(`${id}-product`, JSON.stringify(product));

      if (operation === 'addition') {
        value = product.availableQuantity + rightQuantity;
      } else {
        if (product.availableQuantity >= rightQuantity) {
          value = product.availableQuantity - rightQuantity;
        } else {
          throw new RpcException(ErrorMessages.BAD_REQUEST);
        }
      }

      await this.productRepository.update(id, {
        availableQuantity: value,
      });
    }
  }

  async commitProduct(id: number): Promise<void> {
    await this.cacheManager.del(`${id}-product`);
  }

  async commitUpdatedQuantity(quantityData: QuantityData[]): Promise<void> {
    for (const { productId: id } of quantityData) {
      await this.commitProduct(id);
    }
  }

  async rollbackDeleteNewProduct({ id }: DeleteProductData): Promise<void> {
    await this.checkProductExistence(id);
    await this.productRepository.delete(id);
  }

  async rollbackProduct(id: number): Promise<void> {
    const cachedProduct = await this.cacheManager.get(`${id}-product`);
    if (typeof cachedProduct === 'string') {
      const product = JSON.parse(cachedProduct);
      await this.productRepository.save(product);
      await this.cacheManager.del(`${id}-product`);
    }
  }

  async rollbackDeleteProduct(id: number): Promise<void> {
    await this.productRepository.restore(id);
  }

  async rollbackUpdatedQuantity(quantityData: QuantityData[]) {
    for (const { productId: id } of quantityData) {
      await this.rollbackProduct(id);
    }
  }

  private async checkProductExistence(id: number): Promise<Product> {
    const isExistedProduct = await this.productRepository.findOne({
      where: { id },
    });

    if (!isExistedProduct) {
      throw new RpcException(ErrorMessages.NOT_FOUND);
    }

    return isExistedProduct;
  }
}
