import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomBlockDto } from './create-custom_block.dto';

export class UpdateCustomBlockDto extends PartialType(CreateCustomBlockDto) {}
