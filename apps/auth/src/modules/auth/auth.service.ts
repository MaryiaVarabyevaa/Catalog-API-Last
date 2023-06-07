import { Injectable } from '@nestjs/common';
import {RabbitSubscribe} from "@golevelup/nestjs-rabbitmq";

@Injectable()
export class AuthService {
    @RabbitSubscribe({
        exchange: 'auth',
        routingKey: 'auth-route',
        queue: 'auth-queue',
    })
    public async handleRegister(msg: any) {
        console.log('register');
    }

}
