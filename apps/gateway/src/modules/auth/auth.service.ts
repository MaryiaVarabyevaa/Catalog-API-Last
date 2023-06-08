import {Inject, Injectable, LoggerService} from '@nestjs/common';
import {WINSTON_MODULE_NEST_PROVIDER} from "nest-winston";
import {AmqpConnection} from "@golevelup/nestjs-rabbitmq";
import {exchange, RoutingKey} from "./constants";
import {CreateUserInput, LoginUserInput, UserIdInput} from "./dtos";


@Injectable()
export class AuthService {

    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
        private readonly amqpConnection: AmqpConnection,
    ) {}

    // async register() {
    //   // const res = await this.sendMessage( RoutingKey.REGISTER, {});
    //   //   console.log(res);
    //
    //     const res = await this.amqpConnection.request({
    //         exchange,
    //         routingKey: RoutingKey.REGISTER,
    //         payload: {
    //
    //         }
    //     })
    //     console.log(res);
    //     return 'Register';
    // }

    // async register() {
    //
    //     // await this.sendMessage( RoutingKey.REGISTER, {});
    //     // return this.amqpConnection.createRpc({
    //     //     exchange: '',
    //     //     routingKey: '',
    //     //     data: {}
    //     // })
    // }

    async register(createUserInput: CreateUserInput) {
        const res = await this.sendMessageWithResponse(RoutingKey.REGISTER, createUserInput);
        return res;
    }

    async login(loginUserInput: LoginUserInput) {
        const res = await this.sendMessageWithResponse(RoutingKey.LOGIN, loginUserInput);
        return res;
    }

    async logout(userIdInput: UserIdInput) {
        const res = await this.sendMessageWithResponse(RoutingKey.LOGOUT, userIdInput);
        return res;
    }

    async refreshTokens(userIdInput: UserIdInput) {
        const res = await this.sendMessageWithResponse(RoutingKey.REFRESH_TOKENS, userIdInput);
        return res;
    }

    private async sendMessageWithResponse(
        routingKey: RoutingKey,
        data: any,
    ) {
        return await this.amqpConnection.request({
            exchange,
            routingKey,
            payload: { data }
        })
    }

    private async sendMessage(
        routingKey: RoutingKey,
        data: any,
    ) {
        await this.amqpConnection.publish(exchange, routingKey, { data });
    }
}
