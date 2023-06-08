import {MongooseModuleAsyncOptions} from "@nestjs/mongoose";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {getMongoUri} from "@app/common/database/mongo/get-mongo-uri";

export const getMongoConfig = (): MongooseModuleAsyncOptions => {
    return {
        useFactory: (configService: ConfigService) => ({
            uri: getMongoUri(configService)
        }),
        inject: [ConfigService],
        imports: [ConfigModule]
    }
}
