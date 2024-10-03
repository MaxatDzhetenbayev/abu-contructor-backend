import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  findAll(@Query() { query, local }: { query: string; local: string }) {
    return this.searchService.findByQueryString(query, local);
  }

  //   @Get(':id')
  //   findOne(@Param('id') id: string) {
  //     return this.searchService.findOne(+id);
  //   }

  //   @Patch(':id')
  //   update(@Param('id') id: string, @Body() updateSearchDto: UpdateSearchDto) {
  //     return this.searchService.update(+id, updateSearchDto);
  //   }

  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.searchService.remove(+id);
  //   }
}
