import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_REQUEST_SERVICE, Pattern } from '../constants';
import { ClientProxy } from '@nestjs/microservices';
import { Data, ProductInfo } from '../types';

@Injectable()
export class SendMessageToCatalogHelper {
  constructor(
    @Inject(CATALOG_REQUEST_SERVICE) private catalogClient: ClientProxy,
  ) {}

  async checkProductQuantity(data: ProductInfo[]) {
    const res = await this.sendMessage(Pattern.CHECK_PRODUCT_QUANTITY, data);
    return res;
  }

  private async sendMessage(msg: Pattern, data: ProductInfo[]): Promise<any> {
    const pattern = { cmd: msg };
    return await this.catalogClient.send(pattern, { data }).toPromise();
  }
}
