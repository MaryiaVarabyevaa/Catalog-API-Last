import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_REQUEST_SERVICE, Pattern } from '../constants';
import { ClientProxy } from '@nestjs/microservices';
import { ProductInfo, UpdateQuantityData } from '../types';

@Injectable()
export class SendMessageToCatalogHelper {
  constructor(
    @Inject(CATALOG_REQUEST_SERVICE) private catalogClient: ClientProxy,
  ) {}

  async checkProductQuantity(data: UpdateQuantityData) {
    const res = await this.sendMessage(Pattern.CHECK_PRODUCT_QUANTITY, data);
    return res;
  }

  async commitProductQuantity(data: ProductInfo[]) {
    const res = await this.sendMessage(Pattern.COMMIT_PRODUCT_QUANTITY, data);
    return res;
  }

  async rollbackProductQuantity(data: ProductInfo[]) {
    const res = await this.sendMessage(Pattern.ROLLBACK_PRODUCT_QUANTITY, data);
    return res;
  }

  private async sendMessage(
    msg: Pattern,
    data: ProductInfo[] | UpdateQuantityData,
  ): Promise<any> {
    const pattern = { cmd: msg };
    return await this.catalogClient.send(pattern, { data }).toPromise();
  }
}
