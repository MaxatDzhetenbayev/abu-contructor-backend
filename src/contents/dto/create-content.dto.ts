import { IsNumber, IsObject } from 'class-validator';

export class CreateContentDto {
  @IsObject()
  content: {
    [key: string]: object;
  };

  @IsObject()
  options: {
    [key: string]: any;
  };

  @IsNumber()
  widget_id: number;
}
