import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE, ErrorMessage, Pattern } from './constants';
import { Data, IUser } from './types';

@Injectable()
export class UserService {
  constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

  async validateUser(email: string, password: string): Promise<IUser | null> {
    const res = await this.sendMessageToAuthClient(Pattern.VALIDATE_USER, {
      email,
      password,
    });
    if (!res) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }
    return res;
  }

  private async sendMessageToAuthClient(
    msg: Pattern,
    data: Data,
  ): Promise<IUser | null> {
    const pattern = { cmd: msg };
    return await this.authClient.send(pattern, { data }).toPromise();
  }
}
