import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {AbstractDocument} from '@app/common'
import {Roles} from "../constants";


@Schema({ versionKey: false })
export class User extends AbstractDocument {
    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop({ required: true, enum: Roles, type: String, default: Roles.USER })
    role: Roles;
}

export const UserSchema = SchemaFactory.createForClass(User);