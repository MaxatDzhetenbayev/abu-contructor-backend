import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ContentsService } from './contents.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { UpdateContentOrderDto } from './dto/update-content-order.dto';

@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createContentDto: CreateContentDto) {
    return this.contentsService.create(createContentDto);
  }

  @Get()
  findAll() {
    return this.contentsService.findAll();
  }

  @Get('by-widget-id/:widget_id')
  findAllByWidgetId(@Param('widget_id') widget_id: string) {
    return this.contentsService.findAllByWidgetId(+widget_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
    return this.contentsService.update(+id, updateContentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentsService.remove(+id);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('orders/update')
  updateOrder(@Body() updateOrderDto: UpdateContentOrderDto[]) {
    console.log(updateOrderDto);
    return this.contentsService.updateOrder(updateOrderDto);
  }
}
