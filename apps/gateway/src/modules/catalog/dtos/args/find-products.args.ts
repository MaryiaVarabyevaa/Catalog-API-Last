import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@ArgsType()
export class FindProductsArgs {
  @Field()
  @IsNotEmpty()
  @IsNumber()
  limit: number;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  offset: number;
}
