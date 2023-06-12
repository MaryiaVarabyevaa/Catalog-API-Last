import {Payload} from "./payload.type";

export interface JwtPayload extends Payload {
    iat: number;
    exp: number;
}