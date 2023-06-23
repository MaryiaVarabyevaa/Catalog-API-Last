import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Product } from './entities';
import {
  CreateProductData,
  DeleteProductData,
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
    private dataSource: DataSource,
  ) {}

  async createProduct(createProductData: CreateProductData): Promise<Product> {
    const saga = new UpdateCatalogSaga(
      OperationState.CREATED,
      createProductData,
      this.sendMessageHelper,
      this.dataSource,
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
    );
    await saga.getState().makeOperation();
  }

  async updateQuantity(
    updateQuantityData: UpdateQuantityData,
  ): Promise<Product> {
    const saga = new UpdateCatalogSaga(
      OperationState.UPDATED_QUANTITY,
      updateQuantityData,
      this.sendMessageHelper,
      this.dataSource,
    );
  }
}
