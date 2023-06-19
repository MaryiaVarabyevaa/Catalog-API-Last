import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Data } from '../types';

export const GetData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const message = ctx.switchToRpc().getData<{ data: Data }>();
    const product = message.data;

    if ('id' in product) {
      return { ...product, id: Number(product.id) };
    }

    return product;
  },
);
