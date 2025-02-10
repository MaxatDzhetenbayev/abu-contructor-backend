import {  IsOptional, IsString } from "class-validator";

export class FindQueriesDto {
	@IsOptional()
	@IsString()
	limit: number;
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
	lang?: string;
}
