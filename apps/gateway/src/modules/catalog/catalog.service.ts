import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateProductInput,
  DeleteProductInput,
  FindProductByIdArgs,
  UpdateProductInput,
} from './dtos';
import { CATALOG_REQUEST_SERVICE, CATALOG_SERVICE, Pattern } from './constants';
import { Data } from './types';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class CatalogService {
  constructor(
    @Inject(CATALOG_REQUEST_SERVICE) private catalogRequestClient: ClientProxy,
    @Inject(CATALOG_SERVICE) private catalogClient: ClientProxy,
  ) {}

  async createProduct(
    createProductInput: CreateProductInput,
  ): Promise<ProductEntity> {
    const res = await this.sendMessageToCatalogRequest(
      Pattern.CREATE_PRODUCT,
      createProductInput,
    );
    return res;
  }

  async updateProduct(updateProductInput: UpdateProductInput): Promise<ProductEntity>{
    const updatedProduct = await this.sendMessageToCatalogRequest(
      Pattern.UPDATE_PRODUCT,
      updateProductInput,
    );
    return updatedProduct;
  }

  async deleteProduct(deleteProductInput: DeleteProductInput): Promise<void> {
    await this.sendMessageToCatalogRequest(
      Pattern.DELETE_PRODUCT,
      deleteProductInput,
    );
  }

  async findProductById(
      findProductByIdArgs: FindProductByIdArgs,
  ): Promise<ProductEntity> {
    const product = await this.sendMessageToCatalog<ProductEntity>(
      Pattern.FIND_PRODUCT_BY_ID,
      findProductByIdArgs,
    );
    return product;
  }

  async findAllProducts(): Promise<ProductEntity[]> {
    const products = await this.sendMessageToCatalog<ProductEntity[]>(
      Pattern.FIND_ALL_PRODUCTS,
      {},
    );
    return products;
  }

  private async sendMessageToCatalogRequest(
    msg: Pattern,
    data: Data,
  ): Promise<ProductEntity> {
    const pattern = { cmd: msg };
    return await this.catalogRequestClient.send(pattern, { data }).toPromise();
  }

  private async sendMessageToCatalog<T>(
    msg: Pattern,
    data: FindProductByIdArgs | {},
  ): Promise<T> {
    const pattern = { cmd: msg };
    return await this.catalogClient.send(pattern, { data }).toPromise();
  }
}
