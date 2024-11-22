import { IsObject } from "class-validator"

export class CreateNewsDto {
    @IsObject()
    title: {
        [key: string]: any
    }
    @IsObject()
    content: {
        [key: string]: any
    }
}
