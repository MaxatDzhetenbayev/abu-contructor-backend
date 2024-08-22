import {
    IsArray,
    IsString
} from 'class-validator';

export class CreateTemplateDto {
    @IsString()
    name: string;
    @IsArray()
    widgets_list: string[];
}
