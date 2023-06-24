import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthData } from '../../modules/auth/types';
import { UserData } from '../../modules/user/types';

export const GetData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const message = ctx.switchToRpc().getData<AuthData | UserData>();
    const user = message.data;

    if ('id' in user) {
      return { ...user, id: Number(user.id) };
    }

    return user;
  },
);
