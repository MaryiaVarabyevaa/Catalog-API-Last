import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const req = GqlExecutionContext.create(context).getContext().req;
    const user = req.user;
    return user.sub;
  },
);
