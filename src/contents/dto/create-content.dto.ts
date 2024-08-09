import { IsNumber, IsObject } from 'class-validator'

export class CreateContentDto {
    @IsObject()
    content: {
        [key: string]: any;
    };
    @IsNumber()
    widget_id: number;
}
