import {IsNotEmpty, IsNumber} from "class-validator";

export class FindProductByIdDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;
}