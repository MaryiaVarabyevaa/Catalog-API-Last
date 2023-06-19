import {
  ConflictException,
  Inject,
  Injectable,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AUTH_SERVICE, ErrorMessage, Pattern } from './constants';
import { CreateUserInput, LoginUserInput } from './dtos';
import { DataType, TokenPair } from './types';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
  ) {}

  async register(createUserInput: CreateUserInput): Promise<TokenPair> {
    const res = await this.sendMessageToAuthClient(
      Pattern.REGISTER,
      createUserInput,
    );

    if (!res) {
      throw new ConflictException(ErrorMessage.CONFLICT);
    }
    return res;
  }

  async login(loginUserInput: LoginUserInput): Promise<TokenPair> {
    const res = await this.sendMessageToAuthClient(
      Pattern.LOGIN,
      loginUserInput,
    );
    return res;
  }

  async logout(id: number): Promise<void> {
    await this.sendMessageToAuthClient(Pattern.LOGOUT, { id });
  }

  async refreshTokens(id: number, rt: string): Promise<TokenPair> {
    const res = await this.sendMessageToAuthClient(Pattern.REFRESH, { id, rt });
    if (!res) {
      throw new NotFoundException(ErrorMessage.NOT_FOUND);
    }
    return res;
  }

  private async sendMessageToAuthClient(
    msg: Pattern,
    data: DataType,
  ): Promise<TokenPair | null> {
    const pattern = { cmd: msg };
    return await this.authClient.send(pattern, { data }).toPromise();
  }
}
