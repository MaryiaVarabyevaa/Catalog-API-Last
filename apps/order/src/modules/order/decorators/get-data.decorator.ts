import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Data } from '../types';

export const GetData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const message = ctx.switchToRpc().getData<{ data: Data }>();
    const order = message.data;

    if ('id' in order) {
      return { ...order, id: Number(order.id) };
    }

    return order;
  },
);
