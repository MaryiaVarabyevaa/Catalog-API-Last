import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { winstonLoggerConfig } from '@app/common';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { User } from '../user/entities';
import { JwtHelper } from './helpers';
import { TokenPair } from '../token/types';
import { CreateUserData, LoginUserData, RefreshTokensData } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async register({
    email,
    password,
    firstName,
    lastName,
  }: CreateUserData): Promise<TokenPair> {
    winstonLoggerConfig.info(`Registering user with email ${email}`);

    const user = await this.userService.findUserByEmail(email);
    if (user) {
      winstonLoggerConfig.warn(`User ${email} has been already registered`);
      return null;
    }
    const hashPassword = await this.hashData(password);
    const newUserInfo = {
      email,
      firstName,
      lastName,
      password: hashPassword,
    };

    const newUser = await this.userService.addUser(newUserInfo);
    const tokens = this.generateTokens(newUser);

    winstonLoggerConfig.info(`User ${email} has been registered`);

    return tokens;
  }

  async login({ email }: LoginUserData): Promise<TokenPair> {
    winstonLoggerConfig.info(`Logging in user with email ${email}`);

    const user = await this.userService.findUserByEmail(email);
    const tokens = this.generateTokens(user);

    winstonLoggerConfig.info(`User ${email} has been logged in`);

    return tokens;
  }

  async logout(id: number): Promise<void> {
    winstonLoggerConfig.info(`Logging out user with id ${id}`);

    await this.tokenService.removeRefreshToken(id);

    winstonLoggerConfig.info(`User with id ${id} has been logged out`);
  }

  async refreshTokens({
    id,
    rt,
  }: RefreshTokensData): Promise<TokenPair | null> {
    winstonLoggerConfig.info(`Refreshing tokens for user with id ${id}`);

    const user = await this.userService.findUserById(id);
    if (!user) {
      winstonLoggerConfig.warn(`User with id ${id} was not found`);
      return null;
    }
    const isTokenEqual = await this.tokenService.compareRefreshToken(
      user.id,
      rt,
    );

    if (!isTokenEqual) {
      winstonLoggerConfig.warn(
        `A non-valid token was passed for user with id ${id}`,
      );
      return null;
    }

    const tokens = this.generateTokens(user);

    winstonLoggerConfig.info(
      `New tokens have been generated for user with id ${id}`,
    );

    return tokens;
  }

  private async hashData(data: string): Promise<string> {
    return await bcrypt.hash(data, 10);
  }

  private async generateTokens(user: User): Promise<TokenPair> {
    const payload = JwtHelper.generateJwtPayload(user);
    const tokens = await this.tokenService.generateTokens(payload);
    const hashToken = await this.hashData(tokens.rt);
    await this.tokenService.saveRefreshToken(user.id, hashToken);
    return tokens;
  }
}
