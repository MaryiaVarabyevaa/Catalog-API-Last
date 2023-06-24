import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    // MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }])
  ],
  providers: [SessionService],
})
export class SessionModule {}
