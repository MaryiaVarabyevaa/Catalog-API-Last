import { Injectable } from '@nestjs/common';
import { Payload } from '../../token/types';
import { User } from '../../user/entities';

@Injectable()
export class JwtHelper {
  static generateJwtPayload(user: User): Payload {
    return {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
