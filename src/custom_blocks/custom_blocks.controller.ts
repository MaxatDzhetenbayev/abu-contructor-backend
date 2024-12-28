import {
  Controller,
  Get,
  Post,
  Body,
  //   Patch,
  Param,
  Delete,
  //   Query,
} from '@nestjs/common';
import { CustomBlocksService } from './custom_blocks.service';
import { CreateCustomBlockDto } from './dto/create-custom_block.dto';
// import { UpdateCustomBlockDto } from './dto/update-custom_block.dto';

@Controller('custom-blocks')
export class CustomBlocksController {
  constructor(private readonly customBlocksService: CustomBlocksService) {}

  @Post()
  create(@Body() createCustomBlockDto: CreateCustomBlockDto) {
    return this.customBlocksService.create(createCustomBlockDto);
  }

  //   @Get('')
  //   findAll(@Query('slug') slug: string, @Query('limit') limit: number) {
  //     return this.customBlocksService.findAllBlockBySlug(slug, +limit);
  //   }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customBlocksService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customBlocksService.remove(+id);
  }
}
