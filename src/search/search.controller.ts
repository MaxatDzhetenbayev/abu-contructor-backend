import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  findAll(@Query() { query, locale }: { query: string; locale: string }) {
    return this.searchService.findByQueryString(query, locale);
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
