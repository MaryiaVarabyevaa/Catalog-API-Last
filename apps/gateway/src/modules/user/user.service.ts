import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE, ErrorMessage, Pattern } from './constants';
import { Data, IUser } from './types';

@Injectable()
export class UserService {
  constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

  async validateUser(email: string, password: string): Promise<any> {
    const res = await this.sendMessage(Pattern.VALIDATE_USER, {
      email,
      password,
    });
    if (!res) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }
    return res;
  }

  async changeUserRole(userId: number) {
    const res = await this.sendMessage(Pattern.CHANGE_USER_ROLE, {
      id: userId,
    });
    return res;
  }

  private async sendMessage(msg: Pattern, data: Data): Promise<any> {
    // const pattern = { cmd: msg };
    // return await this.authClient.send(pattern, { data }).toPromise();
  }
}
