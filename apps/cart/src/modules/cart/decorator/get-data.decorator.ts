import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const message = ctx.switchToRpc().getData();
    const cartData = message.data;

    if ('id' in cartData) {
      return { ...cartData, id: Number(cartData.id) };
    }

    return cartData;
  },
);
