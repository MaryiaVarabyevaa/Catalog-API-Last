import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const message = ctx.switchToRpc().getData();
    const user = message.data;
    return Number(user.id);
  },
);
