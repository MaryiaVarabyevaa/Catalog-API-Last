import { Controller } from '@nestjs/common';
import { RmqService } from '@app/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { Pattern } from './constants';
import { GetData, GetId } from '../../common/decorators';
import { TokenPair } from '../token/types';
import { CreateUserData, LoginUserData, RefreshTokensData } from './types';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: Pattern.REGISTER })
  async handleRegister(
    @GetData() createUserData: CreateUserData,
    @Ctx() context: RmqContext,
  ): Promise<TokenPair | null> {
    const res = await this.authService.register(createUserData);
    this.rmqService.ack(context);
    return res;
  }

  @MessagePattern({ cmd: Pattern.LOGIN })
  async handleLogin(
    @GetData() loginUserData: LoginUserData,
    @Ctx() context: RmqContext,
  ): Promise<TokenPair | null> {
    const res = await this.authService.login(loginUserData);
    this.rmqService.ack(context);
    return res;
  }

  @MessagePattern({ cmd: Pattern.LOGOUT })
  async handleLogout(
    @GetId() userId: number,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const res = await this.authService.logout(userId);
    this.rmqService.ack(context);
    return res;
  }

  @MessagePattern({ cmd: Pattern.REFRESH })
  async handleRefreshToken(
    @GetData() refreshTokensData: RefreshTokensData,
    @Ctx() context: RmqContext,
  ): Promise<TokenPair> {
    const res = await this.authService.refreshTokens(refreshTokensData);
    this.rmqService.ack(context);
    return res;
  }

  // @MessagePattern(Pattern.VALIDATE_USER)
  // validateUser(@GetData() { at }: ValidateUserData, @Ctx() context: RmqContext): JwtPayload {
  //     const res = this.tokenService.validateAccessToken(at);
  //     this.rmqService.ack(context);
  //     return res;
  // }
}
