import { CustomBlockContent } from "../entities/custom_block.entity";

export class CreateCustomBlockDto {
    id: number;
    navigation_slug: string
    title: string;
    content: CustomBlockContent
}
