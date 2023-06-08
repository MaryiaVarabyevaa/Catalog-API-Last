import {Field, InputType} from "@nestjs/graphql";
import {CreateUserInput} from "./create-user.input";
import {OmitType} from "@nestjs/mapped-types";
import {IsEmail, IsNotEmpty, IsString, MinLength} from "class-validator";

@InputType()
export class LoginUserInput {
    @Field()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}