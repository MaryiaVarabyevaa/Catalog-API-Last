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

  async createProduct(product: CreateProductData): Promise<Product> {
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

    const savedProduct = await this.productRepository.save(newProduct);
    return savedProduct;
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
    const product = await this.checkProductExistence(id);
    await this.productRepository.softDelete(id);
  }

  // async updateQuantityProduct({
  //   id,
  //   rightQuantity,
  // }: UpdateQuantityData): Promise<void> {
  //   const product = await this.checkProductExistence(id);
  //
  //   await this.cacheManager.set(`${id}-product`, JSON.stringify(product));
  //
  //   if (product.availableQuantity >= rightQuantity) {
  //     await this.productRepository.update(id, {
  //       availableQuantity: product.availableQuantity - rightQuantity,
  //     });
  //   } else {
  //     throw new RpcException(ErrorMessages.BAD_REQUEST);
  //   }
  // }

  async updateQuantityProduct(updateQuantityData: UpdateQuantityData[]): Promise<void> {
    updateQuantityData.map( async({ id, rightQuantity }) => {
      const product = await this.checkProductExistence(id);

      await this.cacheManager.set(`${id}-product`, JSON.stringify(product));

      if (product.availableQuantity >= rightQuantity) {
        await this.productRepository.update(id, {
          availableQuantity: product.availableQuantity - rightQuantity,
        });
      } else {
        throw new RpcException(ErrorMessages.BAD_REQUEST);
      }
    })
  }

  async commitProduct(id: number) {
    try {
      await this.cacheManager.del(`${id}-product`);
    } catch (err) {
      return err;
    }
  }

  async commitUpdatedQuantity(data: UpdateQuantityData[]) {
    data.map(async ({ id }) => {
      await this.commitProduct(id);
    });
  }

  async rollbackDeleteNewProduct({ id }: DeleteProductData): Promise<void> {
    await this.checkProductExistence(id);
    await this.productRepository.delete(id);
  }

  async rollbackProduct(id: number) {
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

  async rollbackUpdatedQuantity(updateQuantityData: UpdateQuantityData[]) {
    updateQuantityData.map(async ({ id }) => {
      await this.rollbackProduct(id);
    });
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
