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
import { winstonLoggerConfig } from '@app/common';

@Injectable()
export class ProductRequestService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async createProduct(product: CreateProductData): Promise<Product> {
    winstonLoggerConfig.info(`Creating product ${JSON.stringify(product)}`);

    const isExistedProduct = await this.productRepository.findOne({
      where: { name: product.name },
    });

    if (isExistedProduct) {
      winstonLoggerConfig.error(`Product ${product.name} already exists`);

      throw new RpcException(ErrorMessages.CONFLICT);
    }

    const newProduct = await this.productRepository.create({
      ...product,
      availableQuantity: product.totalQuantity,
    });

    const res = await this.productRepository.save(newProduct);

    winstonLoggerConfig.info(`Created product ${JSON.stringify(res)}`);

    return res;
  }

  async updatedProduct({ id, ...rest }: UpdateProductData): Promise<Product> {
    winstonLoggerConfig.info(`Updating product with id ${id}`);

    const product = await this.checkProductExistence(id);

    await this.cacheManager.set(`${id}-product`, JSON.stringify(product));

    await this.productRepository.update(id, {
      ...rest,
      availableQuantity: rest.totalQuantity,
    });

    const updatedProduct = await this.productRepository.findOne({
      where: { id },
    });

    winstonLoggerConfig.info(
      `Updated product with id ${id}: ${JSON.stringify(updatedProduct)}`,
    );

    return updatedProduct;
  }

  async deletedProduct({ id }: DeleteProductData): Promise<void> {
    winstonLoggerConfig.info(`Deleting product with id ${id}`);

    await this.checkProductExistence(id);
    await this.productRepository.softDelete(id);

    winstonLoggerConfig.info(`Deleted product with id ${id}`);
  }

  async updateQuantityProduct({
    data,
    operation,
  }: UpdateQuantityData): Promise<void> {
    for (const { productId: id, rightQuantity } of data) {
      winstonLoggerConfig.info(
        `Updating product quantity using operation ${operation}`,
      );

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

      winstonLoggerConfig.info(`Updated product ${id} quantity to ${value}`);
    }
  }

  async commitProduct(id: number): Promise<void> {
    winstonLoggerConfig.info(`Committing product with id ${id}`);

    await this.cacheManager.del(`${id}-product`);

    winstonLoggerConfig.info(`Product with id ${id} committed`);
  }

  async commitUpdatedQuantity(quantityData: QuantityData[]): Promise<void> {
    winstonLoggerConfig.info('Committing updated quantity for products');

    for (const { productId: id } of quantityData) {
      await this.commitProduct(id);

      winstonLoggerConfig.info(
        `Quantity update committed for product with id ${id}`,
      );
    }

    winstonLoggerConfig.info('Quantity updates committed for all products');
  }

  async rollbackDeleteNewProduct({ id }: DeleteProductData): Promise<void> {
    winstonLoggerConfig.info(
      `Rolling back deletion of new product with id ${id}`,
    );

    await this.checkProductExistence(id);
    await this.productRepository.delete(id);

    winstonLoggerConfig.info(
      `Deletion of new product with id ${id} rolled back`,
    );
  }

  async rollbackProduct(id: number): Promise<void> {
    winstonLoggerConfig.info(`Rolling back product with id ${id}`);

    const cachedProduct = await this.cacheManager.get(`${id}-product`);
    if (typeof cachedProduct === 'string') {
      const product = JSON.parse(cachedProduct);
      await this.productRepository.save(product);
      await this.cacheManager.del(`${id}-product`);

      winstonLoggerConfig.info(`Product with id ${id} rolled back`);
    }
  }

  async rollbackDeleteProduct(id: number): Promise<void> {
    winstonLoggerConfig.info(`Rolling back deletion of product with id ${id}`);

    await this.productRepository.restore(id);

    winstonLoggerConfig.info(`Deletion of product with id ${id} rolled back`);
  }

  async rollbackUpdatedQuantity(quantityData: QuantityData[]) {
    winstonLoggerConfig.info('Rolling back updated quantity for products');

    for (const { productId: id } of quantityData) {
      await this.rollbackProduct(id);

      winstonLoggerConfig.info(
        `Quantity update rolled back for product with id ${id}`,
      );
    }

    winstonLoggerConfig.info('Quantity updates rolled back for all products');
  }

  private async checkProductExistence(id: number): Promise<Product> {
    winstonLoggerConfig.info(`Checking existence of product with id ${id}`);

    const isExistedProduct = await this.productRepository.findOne({
      where: { id },
    });

    if (!isExistedProduct) {
      winstonLoggerConfig.error(`Product with id ${id} not found`);
      throw new RpcException(ErrorMessages.NOT_FOUND);
    }

    winstonLoggerConfig.info(`Product with id ${id} exists`);

    return isExistedProduct;
  }
}
