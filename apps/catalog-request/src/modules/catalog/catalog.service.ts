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
import { winstonLoggerConfig } from '@app/common';

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
    winstonLoggerConfig.info(
      `Creating product with data ${JSON.stringify(createProductData)}`,
    );

    const saga = new UpdateCatalogSaga(
      OperationState.CREATED,
      createProductData,
      this.sendMessageHelper,
      this.dataSource,
      this.cacheManager,
    );

    const newProduct = await saga.getState().makeOperation();

    winstonLoggerConfig.info(`Product created with id ${newProduct.id}`);

    return newProduct;
  }

  async updateProduct(updateProductData: UpdateProductData): Promise<Product> {
    winstonLoggerConfig.info(
      `Updating product with id ${updateProductData.id}`,
    );

    const saga = new UpdateCatalogSaga(
      OperationState.UPDATED,
      updateProductData,
      this.sendMessageHelper,
      this.dataSource,
      this.cacheManager,
    );

    const updatedProduct = await saga.getState().makeOperation();

    winstonLoggerConfig.info(`Product with id ${updatedProduct.id} updated`);

    return updatedProduct;
  }

  async deleteProduct(deleteProductData: DeleteProductData): Promise<void> {
    winstonLoggerConfig.info(
      `Deleting product with id ${deleteProductData.id}`,
    );

    const saga = new UpdateCatalogSaga(
      OperationState.DELETED,
      deleteProductData,
      this.sendMessageHelper,
      this.dataSource,
      this.cacheManager,
    );
    await saga.getState().makeOperation();

    winstonLoggerConfig.info(`Product with id ${deleteProductData.id} deleted`);
  }

  async updateQuantity(
    updateQuantityData: UpdateQuantityData[],
  ): Promise<void> {
    winstonLoggerConfig.info(
      `Updating quantity for ${updateQuantityData.length} products`,
    );

    const saga = new UpdateCatalogSaga(
      OperationState.UPDATED_QUANTITY,
      updateQuantityData,
      this.sendMessageHelper,
      this.dataSource,
      this.cacheManager,
    );
    await saga.getState().makeOperation();

    winstonLoggerConfig.info(
      `Quantity for ${updateQuantityData.length} products updated`,
    );
  }

  async commitProductQuantity(productInfo: ProductInfo[]): Promise<void> {
    for (const { productId: id } of productInfo) {
      await this.cacheManager.del(`${id}-product`);
    }

    winstonLoggerConfig.info(
      `Committed updated quantity for ${productInfo.length} products`,
    );

    await this.sendMessageHelper.commitUpdatedQuantity(productInfo);

    winstonLoggerConfig.info(
      `Updated quantity for ${productInfo.length} products committed`,
    );
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

    winstonLoggerConfig.info(
      `Rolled back updated quantity for ${productInfo.length} products`,
    );

    await this.sendMessageHelper.rollbackUpdatedQuantity(productInfo);

    winstonLoggerConfig.info(
      `Updated quantity for ${productInfo.length} products rolled back`,
    );
  }
}
