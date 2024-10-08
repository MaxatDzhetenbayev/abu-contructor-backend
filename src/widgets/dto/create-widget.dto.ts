import { IsNumber, IsString, IsObject } from 'class-validator';

export class CreateWidgetDto {
  @IsString()
  widget_type: string;

  @IsObject()
  options: { [key: string]: any };

  @IsNumber()
  navigation_id: number;
}
