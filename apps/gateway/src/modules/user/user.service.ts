import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE, ErrorMessage, Pattern } from './constants';
import { Data } from './types';
import { TokenPair } from '../auth/types';
import { User } from '../auth/entities';

@Injectable()
export class UserService {
  constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

  async validateUser(email: string, password: string): Promise<User> {
    const res = await this.sendMessage<User>(Pattern.VALIDATE_USER, {
      email,
      password,
    });
    if (!res) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }
    return res;
  }

  async changeUserRole(userId: number): Promise<TokenPair> {
    const res = await this.sendMessage<TokenPair>(Pattern.CHANGE_USER_ROLE, {
      id: userId,
    });
    return res;
  }

  private async sendMessage<T>(msg: Pattern, data: Data): Promise<T> {
    const pattern = { cmd: msg };
    return await this.authClient.send(pattern, { data }).toPromise();
  }
}
