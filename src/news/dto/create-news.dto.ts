import { IsObject, IsISO8601, IsOptional } from 'class-validator';

export class CreateNewsDto {
  @IsObject()
  title: {
    [key: string]: string;
  };

  @IsOptional()
  @IsISO8601()
  createdAt: string;

  @IsObject()
  content: {
    [key: string]: any;
  };
}

export class CreateNewsData {
  @IsObject()
  data: CreateNewsDto;
}
