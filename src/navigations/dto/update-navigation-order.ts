import { IsNumber } from 'class-validator';

export class UpdateNavigationOrderDto {
  @IsNumber()
  order: number;
  @IsNumber()
  id: number;
}
