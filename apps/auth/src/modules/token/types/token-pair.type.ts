import {AccessToken} from "./access-token.type";
import {RefreshToken} from "./refresh-token.type";

export type TokenPair = RefreshToken & AccessToken;