import {Field, ID, ObjectType} from "@nestjs/graphql";


// ObjectType включает те поля, которые клиент
// может запросить у сервера
@ObjectType()
export class User {

    @Field()
    id: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    email:string;
}