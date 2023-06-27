import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AtGuard } from '../auth/guards';
import { UserService } from './user.service';
import { Roles } from '../../common/decorators';
import { setCookies } from '../auth/helpers';
import { ExpressRes } from '../auth/decorators';
import { Response } from 'express';
import { RolesGuard } from '../../common/guargs';
import { UserRoles } from '../../common/constants';
import { ChangeUserRoleInput } from './dtos';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => String)
  async greetHey() {
    return 'Hello';
  }

  @Mutation(() => Boolean)
  @Roles(UserRoles.ADMIN)
  @UseGuards(AtGuard, RolesGuard)
  async changeUserRole(
    @Args('loginUser') { userId }: ChangeUserRoleInput,
    @ExpressRes() res: Response,
  ): Promise<boolean> {
    const { rt, at } = await this.userService.changeUserRole(userId);
    setCookies(res, rt, at);
    return true;
  }
}
