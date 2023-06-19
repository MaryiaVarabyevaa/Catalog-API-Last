import {Inject, Injectable,} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {CreateProductInput, DeleteProductInput, GetProductArgs, UpdateProductInput,} from './dtos';
import {CATALOG_REQUEST_SERVICE, Pattern} from "./constants";
import {Data} from "./types";
import {ProductEntity} from "./entities/product.entity";


@Injectable()
export class CatalogService {
  constructor(
      @Inject(CATALOG_REQUEST_SERVICE) private catalogClient: ClientProxy,
  ) {}

  async createProduct(createProductInput: CreateProductInput): Promise<ProductEntity> {
    const res = await this.sendMessage(Pattern.CREATE_PRODUCT, createProductInput);
    return res;
  }

  async updateProduct(updateProductInput: UpdateProductInput) {
    // const updatedProduct = await this.sendMessageWithResponse(
    //   RoutingKey.UPDATE_PRODUCT,
    //   updateProductInput,
    // );
    // if (updatedProduct) {
    //   throw new NotFoundException(ErrorMessage.NOT_FOUNT);
    // }
    // return updatedProduct;
  }

  async deleteProduct(deleteProductInput: DeleteProductInput) {
    // const res = await this.sendMessageWithResponse(
    //   RoutingKey.DELETE_PRODUCT,
    //   deleteProductInput,
    // );
    // if (!res) {
    //   throw new NotFoundException(ErrorMessage.NOT_FOUNT);
    // }
    // return res;
  }

  async findProductById(getProductArgs: GetProductArgs) {
    // const res = await this.sendMessageWithResponse(
    //   RoutingKey.FIND_PRODUCT_BY_ID,
    //   getProductArgs,
    // );
    // return res;
  }

  //
  // async findAllProducts() {
  //   await this.sendMessage(RoutingKey.FIND_ALL_PRODUCTS, {});
  //   return 'find all products route';
  // }

  private async sendMessage(
      msg: Pattern,
      data: Data,
  ): Promise<ProductEntity> {
    const pattern = { cmd: msg };
    return await this.catalogClient.send(pattern, { data }).toPromise();
  }
}
