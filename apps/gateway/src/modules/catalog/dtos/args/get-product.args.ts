import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@ArgsType()
export class GetProductArgs {
  @Field(() => ID)
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
