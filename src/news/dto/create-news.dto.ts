import { IsObject, IsISO8601, IsOptional, IsEnum } from 'class-validator';
import { NewsSource } from '../entities/news.entity';

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

  @IsEnum(NewsSource)
  source?: NewsSource;
}

export class CreateNewsData {
  @IsObject()
  data: CreateNewsDto;
}
