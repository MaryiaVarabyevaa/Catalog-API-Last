import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE, ErrorMessage, Pattern } from './constants';
import { CreateUserInput, LoginUserInput } from './dtos';
import { DataType, TokenPair } from './types';

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

  async register(createUserInput: CreateUserInput): Promise<TokenPair> {
    const res = await this.sendMessage(Pattern.REGISTER, createUserInput);

    if (!res) {
      throw new ConflictException(ErrorMessage.CONFLICT);
    }
    return res;
  }

  async login(loginUserInput: LoginUserInput): Promise<TokenPair> {
    // winstonLogger.info('This is an info message');
    const res = await this.sendMessage(Pattern.LOGIN, loginUserInput);
    return res;
  }

  async logout(id: number): Promise<void> {
    await this.sendMessage(Pattern.LOGOUT, { id });
  }

  async refreshTokens(id: number, rt: string): Promise<TokenPair> {
    const res = await this.sendMessage(Pattern.REFRESH, { id, rt });
    if (!res) {
      throw new NotFoundException(ErrorMessage.NOT_FOUND);
    }
    return res;
  }

  private async sendMessage(
    msg: Pattern,
    data: DataType,
  ): Promise<TokenPair | null> {
    const pattern = { cmd: msg };
    return await this.authClient.send(pattern, { data }).toPromise();
  }
}
