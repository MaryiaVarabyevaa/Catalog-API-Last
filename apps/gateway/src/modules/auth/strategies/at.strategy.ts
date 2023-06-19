import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.at;
        },
      ]),
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
      // passReqToCallback: true,
    });
  }

  // принимает декодированный объект токена
  validate(payload: any) {
    return payload;
  }
}
