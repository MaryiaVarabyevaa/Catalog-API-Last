import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Response } from 'express';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserInput, LoginUserInput } from './dtos';
import { AtGuard, LocalAuthGuard, RtGuard } from './guards';
import { ExpressRes } from './decorators';
import { clearCookies, setCookies } from './helpers';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
import { GetCurrentUserId } from '../../common/decorators';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  async greet() {
    return 'Hello';
  }

  @Mutation(() => Boolean)
  async register(
    @Args('createUser') createUserInput: CreateUserInput,
    @ExpressRes() res: Response,
  ): Promise<boolean> {
    const { rt, at } = await this.authService.register(createUserInput);
    setCookies(res, rt, at);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(LocalAuthGuard)
  async login(
    @Args('loginUser') loginUserInput: LoginUserInput,
    @ExpressRes() res: Response,
  ): Promise<boolean> {
    const { rt, at } = await this.authService.login(loginUserInput);
    setCookies(res, rt, at);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(AtGuard)
  async logout(
    @GetCurrentUserId() userId: number,
    @ExpressRes() res: Response,
  ): Promise<boolean> {
    await this.authService.logout(userId);
    clearCookies(res);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(RtGuard)
  async refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('rt') refreshToken: string,
    @ExpressRes() res: Response,
  ): Promise<boolean> {
    const { rt, at } = await this.authService.refreshTokens(
      userId,
      refreshToken,
    );
    setCookies(res, rt, at);
    return true;
  }
}
