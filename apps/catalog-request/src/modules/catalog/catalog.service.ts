import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities';
import {
  CreateProductData,
  DeleteProductData,
  ProductInfo,
  UpdateProductData,
  UpdateQuantityData,
} from './types';
import { OperationState } from './constants';
import { UpdateCatalogSaga } from './sagas';
import { SendMessageHelper } from './helpers';

@Injectable()
export class CatalogService {
  constructor(
    private readonly sendMessageHelper: SendMessageHelper,
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createProduct(createProductData: CreateProductData): Promise<Product> {
    const saga = new UpdateCatalogSaga(
        OperationState.CREATED,
        createProductData,
        this.sendMessageHelper,
        this.dataSource,
        this.cacheManager,
    );

    const newProduct = await saga.getState().makeOperation();

    return newProduct;
  }

  async updateProduct(updateProductData: UpdateProductData): Promise<Product> {
    const saga = new UpdateCatalogSaga(
      OperationState.UPDATED,
      updateProductData,
      this.sendMessageHelper,
      this.dataSource,
      this.cacheManager,
    );

    const updatedProduct = await saga.getState().makeOperation();
    return updatedProduct;
  }

  async deleteProduct(deleteProductData: DeleteProductData): Promise<void> {
    const saga = new UpdateCatalogSaga(
      OperationState.DELETED,
      deleteProductData,
      this.sendMessageHelper,
      this.dataSource,
      this.cacheManager,
    );
    await saga.getState().makeOperation();
  }

  async updateQuantity(
    updateQuantityData: UpdateQuantityData[],
  ): Promise<void> {
    const saga = new UpdateCatalogSaga(
      OperationState.UPDATED_QUANTITY,
      updateQuantityData,
      this.sendMessageHelper,
      this.dataSource,
      this.cacheManager,
    );
    await saga.getState().makeOperation();
  }

  async commitProductQuantity(productInfo: ProductInfo[]): Promise<void> {
    for (const { productId: id } of productInfo) {
      await this.cacheManager.del(`${id}-product`);
    }

    await this.sendMessageHelper.commitUpdatedQuantity(productInfo);
  }

  async rollbackProductQuantity(productInfo: ProductInfo[]): Promise<void> {
    for (const { productId: id } of productInfo) {
      const cachedProduct = await this.cacheManager.get(`${id}-product`);
      if (typeof cachedProduct === 'string') {
        const product = JSON.parse(cachedProduct);
        await this.productRepository.save(product);
        await this.cacheManager.del(`${id}-product`);
      }
    }

    await this.sendMessageHelper.rollbackUpdatedQuantity(productInfo);
  }
}
