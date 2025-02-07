import { IsObject } from 'class-validator';

export class CreateNewsDto {
  @IsObject()
  title: {
    [key: string]: string;
  };
  @IsObject()
  content: {
    [key: string]: any;
  };
}

export class CreateNewsData {
  @IsObject()
  data: CreateNewsDto;
}
