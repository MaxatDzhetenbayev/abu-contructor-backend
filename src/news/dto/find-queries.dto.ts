import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum Languages {
  RU = 'ru',
  KZ = 'kz',
  EN = 'en',
}

export class FindQueriesDto {
  @IsOptional()
  @IsString()
  limit: number;
  @IsEnum(Languages)
  lang: Languages;
  @IsOptional()
  @IsString()
  offset?: number;
  @IsOptional()
  query?: string;
  @IsOptional()
  startDate?: string;
  @IsOptional()
  endDate?: string;
}
