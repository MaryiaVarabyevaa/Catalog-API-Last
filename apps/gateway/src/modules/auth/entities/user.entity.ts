import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

// ObjectType включает те поля, которые клиент
// может запросить у сервера
@ObjectType()
@Directive('@key(fields: "id")')
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;
}
