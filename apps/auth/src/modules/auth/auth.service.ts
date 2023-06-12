import {Inject, Injectable, LoggerService} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {RabbitRPC, RabbitSubscribe} from "@golevelup/nestjs-rabbitmq";
import {exchange, Queue, RoutingKey} from "./constants";
import {UserService} from "../user/user.service";
import {TokenService} from "../token/token.service";
import {User} from "../user/entities";
import {JwtHelper} from "./helpers";
import {TokenPair} from "../token/types";
import {WINSTON_MODULE_NEST_PROVIDER} from "nest-winston";
import {IUser, RefreshTokensData} from "./types";
import {LoginData, LogoutData} from "../../common/types";



@Injectable()
export class AuthService {

    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
        private readonly userService: UserService,
        private readonly tokenService: TokenService
    ) {}

    @RabbitRPC({
        exchange,
        routingKey: RoutingKey.REGISTER,
        queue: Queue.REGISTER,
    })
    async handleRegister({ email, password, lastName, firstName }: IUser): Promise<TokenPair> {
        this.logger.log(`Registration user with ${email} email`);
        const user = await this.userService.findUserByEmail(email);
        if (user) {
            this.logger.warn(`User with ${email} is already existed`);
            return null;
        }
        const hashPassword = await this.hashData(password);
        const newUserInfo = {
            email,
            firstName,
            lastName,
            password: hashPassword,
        };

        const newUser = await this.userService.addUser(newUserInfo as User);
        const tokens = this.generateTokens(newUser);
        this.logger.log(`User with ${email} email registered successfully`)
        return tokens;
    }

    @RabbitRPC({
        exchange,
        routingKey: RoutingKey.LOGIN,
        queue: Queue.LOGIN,
    })
    async handleLogin({ email }: LoginData): Promise<TokenPair> {
        this.logger.log(`Login user with ${email} email`);
        const user = await this.userService.findUserByEmail(email);
        const tokens = this.generateTokens(user);
        this.logger.log(`User with ${email} email logged in successfully`);
        return tokens;
    }


    @RabbitSubscribe({
        exchange,
        routingKey: RoutingKey.LOGOUT,
        queue: Queue.LOGOUT,
    })
    async handleLogout({ id }: LogoutData): Promise<void> {
        this.logger.log(`Logout user with ${id} id`);
        await this.tokenService.removeRefreshToken(id);
        this.logger.log(`User with ${id} id logged out successfully`);
    }

    @RabbitRPC({
        exchange,
        routingKey: RoutingKey.REFRESH_TOKENS,
        queue: Queue.REFRESH_TOKENS,
    })
    async handleRefreshTokens({ id, rt }: RefreshTokensData): Promise<TokenPair | null>  {
        this.logger.log(`Refresh tokens for user with ${id} id`);
        const user = await this.userService.findUserById(id);
        if (!user) {
            this.logger.error(`User with ${id} doesnt exist`);
            return null;
        }
        const isTokenEqual = await this.tokenService.compareRefreshToken(user.id, rt);

        if (!isTokenEqual) {
            this.logger.error(`This received refresh token is not valid`)
            return null;
        }

        const tokens = this.generateTokens(user);
        this.logger.log(`Tokens refreshed successfully to user with ${id} id`);
        return tokens;
    }

    private async hashData(data: string): Promise<string> {
        return await bcrypt.hash(data, 10);
    }

    private async generateTokens(user: User): Promise<TokenPair> {
        const payload = JwtHelper.generateJwtPayload(user);
        const tokens = await this.tokenService.generateTokens(payload);
        const hashToken = await this.hashData(tokens.rt);
        await this.tokenService.saveRefreshToken(user.id, hashToken);
        return tokens;
    }
}
