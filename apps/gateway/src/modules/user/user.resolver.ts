import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AtGuard } from '../auth/guards';
import { UserService } from './user.service';
import { GetCurrentUserId } from '../../common/decorators';
// import {GetCurrentUserId} from "../../common/decorators/get-current-user-id.decorator";
// import { GetCurrentUserId } from '../../common/decorators';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => String)
  async greetHey() {
    return 'Hello';
  }

  @Mutation(() => Boolean)
  @UseGuards(AtGuard)
  async changeUserRole(@GetCurrentUserId() userId: number): Promise<boolean> {
    await this.userService.changeUserRole(userId);
    // setCookies(res, rt, at);
    return true;
  }
}
