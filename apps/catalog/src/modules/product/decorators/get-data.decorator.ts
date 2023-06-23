import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Data } from '../types';

export const GetData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const message = ctx.switchToRpc().getData<Data>();
    const catalog = message.data;

    if ('id' in catalog) {
      return { ...catalog, id: Number(catalog.id) };
    }

    return catalog;
  },
);
