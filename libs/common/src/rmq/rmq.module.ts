import {ConfigService} from "@nestjs/config";

export const getRmqConfig = () => {
    return {
        useFactory: (configService: ConfigService) => ({
            uri: configService.get<string>('RMQ_URI')
        })
    }
}