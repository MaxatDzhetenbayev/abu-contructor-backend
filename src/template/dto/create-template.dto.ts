import {
    IsArray,
    IsString
} from 'class-validator';

export class CreateTemplateDto {
    @IsString()
    title: string;
    @IsArray()
    widgets: string[];
}
