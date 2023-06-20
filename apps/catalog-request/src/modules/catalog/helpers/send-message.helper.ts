import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_SERVICE, Pattern } from '../constants';
import { ClientProxy } from '@nestjs/microservices';
import { Data } from '../types';
import { Product } from '../entities';

@Injectable()
export class SendMessageHelper {
  constructor(@Inject(CATALOG_SERVICE) private catalogClient: ClientProxy) {}

  async createProduct(data: Data) {
    const res = await this.sendMessage(Pattern.PRODUCT_CREATED, data);
    return res;
  }

  async updateProduct(data: Data) {
    const res = await this.sendMessage(Pattern.PRODUCT_UPDATED, data);
    return res;
  }

  async deleteProduct(data: Data): Promise<void> {
    await this.sendMessage(Pattern.PRODUCT_DELETED, data);
  }

  async updateProductQuantity(data: Data) {
    const res = await this.sendMessage(Pattern.PRODUCT_QUANTITY_CHANGED, data);
    return res;
  }

  async commitProduct(data: Data) {
    const res = await this.sendMessage(Pattern.COMMIT_PRODUCT, data);
    return res;
  }

  async rollbackProduct(data: Data) {
    const res = await this.sendMessage(Pattern.ROLLBACK_PRODUCT, data);
    return res;
  }

  async rollbackDeleteNewProduct(data: Data) {
    const res = await this.sendMessage(
      Pattern.ROLLBACK_DELETE_NEW_PRODUCT,
      data,
    );
    return res;
  }

  async rollbackDeleteProduct(data: Data) {
    const res = await this.sendMessage(Pattern.ROLLBACK_DELETE_PRODUCT, data);
    return res;
  }

  private async sendMessage(msg: Pattern, data: Data): Promise<Product> {
    const pattern = { cmd: msg };
    return await this.catalogClient.send(pattern, { data }).toPromise();
  }
}
