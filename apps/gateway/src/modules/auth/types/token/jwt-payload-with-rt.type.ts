import {TokenPayload} from "./token-payload.type";
import {RT} from "./refresh-token.type";

export type JwtPayloadWithRt = TokenPayload & { rt: RT };