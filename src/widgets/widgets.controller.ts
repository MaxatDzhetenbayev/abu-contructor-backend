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
import { WidgetsService } from './widgets.service';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';
import { UpdateWidgetOrderDto } from './dto/update-widget-order';

@Controller('widgets')
export class WidgetsController {
  constructor(private readonly widgetsService: WidgetsService) {}

  @Post()
  create(@Body() createWidgetDto: CreateWidgetDto) {
    return this.widgetsService.create(createWidgetDto);
  }

  @Get()
  findAll() {
    return this.widgetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.widgetsService.findOne(+id);
  }

  @Get('by-navigation-id/:navigation_id')
  findByNavigationId(@Param('navigation_id') navigation_id: string) {
    return this.widgetsService.findByNavigationId(+navigation_id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWidgetDto: UpdateWidgetDto) {
    return this.widgetsService.update(+id, updateWidgetDto);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('orders/update')
  updateOrder(@Body() updateOrderDto: UpdateWidgetOrderDto[]) {
    return this.widgetsService.updateOrder(updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.widgetsService.remove(+id);
  }
}
