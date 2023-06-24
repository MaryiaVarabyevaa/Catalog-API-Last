import { CreateUserData } from './create-user-data.type';
import { LoginUserData } from './login-user-data.type';
import { LogoutUserData } from './logout-user-data.type';
import { RefreshTokensData } from './refresh-tokens-data';

export type AuthData = {
  data: CreateUserData | LoginUserData | LogoutUserData | RefreshTokensData;
};
