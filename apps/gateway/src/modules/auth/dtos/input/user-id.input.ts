import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UserIdInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  id: string;
}
