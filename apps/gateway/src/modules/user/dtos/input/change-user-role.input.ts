import {Field, InputType} from "@nestjs/graphql";
import {IsNotEmpty, IsNumber} from "class-validator";

@InputType()
export class ChangeUserRoleInput {
    @Field()
    @IsNotEmpty()
    @IsNumber()
    userId: number;
}