import * as bcrypt from 'bcrypt';
import {Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {ExpireTime} from "./constants";
import {JwtPayload, Payload, TokenPair} from "./types";
import {InjectRepository} from "@nestjs/typeorm";
import {Token} from "./entities";
import {Repository} from "typeorm";


@Injectable()
export class TokenService {

    constructor(
        private readonly jwtService: JwtService,
        private configService: ConfigService,
        @InjectRepository(Token)
        private tokenRepository: Repository<Token>,
    ) {}

    async generateTokens(payload: Payload): Promise<TokenPair> {
        const [rt, at] = await Promise.all([
            this.generateRefreshToken(payload),
            this.generateAccessToken(payload),
        ]);
        return { rt, at };
    }

    validateRefreshToken(rt: string): JwtPayload {
        const decodedToken = this.jwtService.verify(rt, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        });
        return decodedToken;
    }

    validateAccessToken(at: string): JwtPayload {
        const decodedToken = this.jwtService.verify(at, {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        });
        return decodedToken;
    }

    async compareRefreshToken(
        userId: number,
        rt: string,
    ): Promise<boolean> {
        const token = await this.tokenRepository.findOne({ where: { userId } })
        const isTokenEqual = await bcrypt.compare(rt, token.rt);
        return isTokenEqual ? true : false;
    }

    async saveRefreshToken(userId: number, rt: string): Promise<void> {
        const token = await this.tokenRepository.findOne({ where: { userId } })
        if (token) {
            await this.tokenRepository.update(userId, { rt });
            return;
        }

        const tokenInfo = await this.tokenRepository.create({ rt, userId });
        await this.tokenRepository.save(tokenInfo);
    }

    async removeRefreshToken(userId: number): Promise<void> {
        await this.tokenRepository.delete({ userId });
    }

    private async generateRefreshToken(payload: Payload): Promise<string> {
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: ExpireTime.RT,
        });
    }

    private async generateAccessToken(payload: Payload): Promise<string> {
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: ExpireTime.AT,
        });
    }


}
