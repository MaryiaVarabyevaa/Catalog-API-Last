import { Response } from 'express';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const ExpressRes = createParamDecorator(
  (data: unknown, context: ExecutionContext): Response => {
    const ctx = GqlExecutionContext.create(context).getContext();
    return ctx.res;
  },
);
