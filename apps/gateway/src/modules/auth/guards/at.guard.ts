import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

export class AtGuard extends AuthGuard('jwt-access') {
  constructor() {
    super();
  }
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  // canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
  //     const isPublic = this.reflector.getAllAndOverride(
  //         'isPublic',
  //         [context.getHandler(),context.getClass()]
  //     );
  //
  //     if (isPublic){
  //         return true;
  //     }
  //
  //     return super.canActivate(context);
  // }
}
