import { IsNumber } from "class-validator";

export class UpdateContentOrderDto {
    @IsNumber()
    order: number;
    @IsNumber()
    id: number;
}