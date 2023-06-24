import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CART_SERVICE, Pattern } from '../constants';
import { ClearCart, Data } from '../types';

@Injectable()
export class SendMessageToCartHelper {
  constructor(@Inject(CART_SERVICE) private cartClient: ClientProxy) {}

  async getCart(data: Data) {
    const res = await this.sendMessage(Pattern.GET_CURRENT_CART_TO_ORDER, data);
    return res;
  }

  async commitGetCart(data: Data) {
    const res = await this.sendMessage(Pattern.COMMIT_GET_CART, data);
    return res;
  }

  async rollbackGetCart(data: Data) {
    const res = await this.sendMessage(Pattern.ROLLBACK_GET_CART, data);
    return res;
  }

  async clearCart(data: Data) {
    const res = await this.sendMessage(Pattern.CLEAR_CART, data);
  }

  private async sendMessage(msg: Pattern, data: Data): Promise<any> {
    const pattern = { cmd: msg };
    return await this.cartClient.send(pattern, { data }).toPromise();
  }
}
