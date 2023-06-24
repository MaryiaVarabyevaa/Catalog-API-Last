import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
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
    const user = await this.userService.findUserByEmail(email);
    if (user) {
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
    return tokens;
  }

  async login({ email }: LoginUserData): Promise<TokenPair> {
    const user = await this.userService.findUserByEmail(email);
    const tokens = this.generateTokens(user);
    return tokens;
  }

  async logout(id: number): Promise<void> {
    await this.tokenService.removeRefreshToken(id);
  }

  async refreshTokens({
    id,
    rt,
  }: RefreshTokensData): Promise<TokenPair | null> {
    const user = await this.userService.findUserById(id);
    if (!user) {
      return null;
    }
    const isTokenEqual = await this.tokenService.compareRefreshToken(
      user.id,
      rt,
    );

    if (!isTokenEqual) {
      return null;
    }

    const tokens = this.generateTokens(user);
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
