import { IsEnum, IsOptional, IsString } from 'class-validator';
import { NewsSource } from '../entities/news.entity';

export enum Languages {
  RU = 'ru',
  KZ = 'kz',
  EN = 'en',
}

export class FindQueriesDto {
  @IsOptional()
  @IsString()
  limit: number;
  @IsOptional()
  @IsEnum(Languages)
  lang?: Languages;
  @IsOptional()
  @IsString()
  offset?: number;
  @IsOptional()
  query?: string;
  @IsOptional()
  startDate?: string;
  @IsOptional()
  endDate?: string;
  @IsOptional()
  @IsEnum(NewsSource)
  source?: NewsSource;
}
