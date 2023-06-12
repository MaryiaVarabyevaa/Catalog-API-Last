import {
    ConflictException,
    HttpCode,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    LoggerService, NotFoundException
} from '@nestjs/common';
import {WINSTON_MODULE_NEST_PROVIDER} from "nest-winston";
import {AmqpConnection} from "@golevelup/nestjs-rabbitmq";
import {ErrorMessage, exchange, RoutingKey} from "./constants";
import {CreateUserInput, LoginUserInput} from "./dtos";
import {DataType, TokenPair} from "./types";


@Injectable()
export class AuthService {

    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
        private readonly amqpConnection: AmqpConnection,
    ) {}


    async register(createUserInput: CreateUserInput): Promise<TokenPair> {
        this.logger.log(`Registration user with ${createUserInput.email} email`);
        const res = await this.sendMessageWithResponse(RoutingKey.REGISTER, createUserInput);
        if (!res) {
            this.logger.error(`Registration user with ${createUserInput.email} email failed`);
            throw new ConflictException(ErrorMessage.CONFLICT)
        }
        this.logger.log(`User with ${createUserInput.email} email registered successfully`);
        return res;
    }

    async login(loginUserInput: LoginUserInput): Promise<TokenPair> {
        this.logger.log(`Login user with ${loginUserInput.email} email`);
        const res = await this.sendMessageWithResponse(RoutingKey.LOGIN, loginUserInput);
        this.logger.log(`User with ${loginUserInput.email} email logged in successfully`);
        return res;
    }

    async logout(id: number): Promise<void> {
        this.logger.log(`Logout user with ${id} id`);
        await this.sendMessage(RoutingKey.LOGOUT, { id });
        this.logger.log(`User with ${id} id logged out successfully`);
    }

    async refreshTokens(id: number, rt: string): Promise<TokenPair> {
        this.logger.log(`Refresh tokens for user with ${id} id`);
        const res = await this.sendMessageWithResponse(RoutingKey.REFRESH_TOKENS, { id, rt });
        if (!res) {
            this.logger.error(`User with ${id} id doesnt exist`);
            throw new NotFoundException(ErrorMessage.NOT_FOUND);
        }
        this.logger.log(`Tokens refreshed successfully to user with ${id} id`);
        return res;
    }


    private async sendMessageWithResponse(
        routingKey: RoutingKey,
        data: DataType,
    ): Promise<TokenPair> {
        return await this.amqpConnection.request({
            exchange,
            routingKey,
            payload: { ...data }
        })
    }

    private async sendMessage(
        routingKey: RoutingKey,
        data: DataType,
    ): Promise<void> {
        await this.amqpConnection.publish(exchange, routingKey, { ...data });
    }
}
