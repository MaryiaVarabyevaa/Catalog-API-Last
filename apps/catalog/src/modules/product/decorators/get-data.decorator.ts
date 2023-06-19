import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Data } from '../types';

export const GetData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const message = ctx.switchToRpc().getData<Data>();
    const user = message.data;

    if ('id' in user) {
      return { ...user, id: Number(user.id) };
    }

    return user;
  },
);
