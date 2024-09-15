import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateOrderDto } from './dto/update-template-order.dto';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) { }

  @Post()
  create(@Body() createTemplateDto: CreateTemplateDto) {
    return this.templateService.create(createTemplateDto);
  }

  @Get()
  findAll() {
    return this.templateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.templateService.findOne(+id);
  }

  @Get('search')
  search(@Query() query: { title: string }) {
    const { title } = query
    return this.templateService.findByTitle(title);
  }

  @Patch('v2/orders/update/:id')
  updateOrder(@Param('id') id: string, @Body() updateTemplateDto: UpdateTemplateOrderDto) {
    return this.templateService.updateOrder(+id, updateTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.templateService.remove(+id);
  }
}
