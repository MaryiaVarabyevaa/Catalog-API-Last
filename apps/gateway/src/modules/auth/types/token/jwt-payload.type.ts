import { TokenPayload } from './token-payload.type';

export interface JwtPayload extends TokenPayload {
  iat: number;
  exp: number;
}
