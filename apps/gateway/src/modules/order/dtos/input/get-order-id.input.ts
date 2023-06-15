import {Field, ID, InputType} from "@nestjs/graphql";

@InputType()
export class GetIdInput {

    @Field(() => ID)
    id: number;

}
