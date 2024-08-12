import { IsNumber } from 'class-validator';

export class UpdateWidgetOrderDto {
  @IsNumber()
  order: number;
  @IsNumber()
  id: number;
}
