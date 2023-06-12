import cookieParser from 'cookie-parser';
import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {RabbitMQModule} from "@golevelup/nestjs-rabbitmq";

@Module({
    imports: [ RabbitMQModule.forRoot(RabbitMQModule, {
        exchanges: [
            {
                name: 'auth',
                type: 'topic',
            },
        ],
        uri: 'amqp://rmq',
    }),],
    exports: [RabbitMQModule]
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(cookieParser()).forRoutes('*');
    }
}