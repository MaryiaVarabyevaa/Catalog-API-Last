import {Module} from '@nestjs/common';
import {AuthModule} from "./modules/auth/auth.module";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth/.env',
    }),
      AuthModule
  ],
})
export class AppModule {}
