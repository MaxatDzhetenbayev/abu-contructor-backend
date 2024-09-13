import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { NavigationsService } from './navigations.service';
import { CreateNavigationDto } from './dto/create-navigation.dto';
import { UpdateNavigationDto } from './dto/update-navigation.dto';
import { UpdateNavigationOrderDto } from './dto/update-navigation-order';

interface UpdateNavigationOrderDtoNew {
  id: number;
  target_id: number;
  parent_id?: number | null;
}

@Controller('navigations')
export class NavigationsController {
  constructor(private readonly navigationsService: NavigationsService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createNavigationDto: CreateNavigationDto) {
    return this.navigationsService.create(createNavigationDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    return this.navigationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.navigationsService.findOne(+id);
  }

  @HttpCode(HttpStatus.OK)
  @Get('find/by-slug')
  findBySlug(@Query('slug') slug: string) {
    return this.navigationsService.findBySlug(slug);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNavigationDto: UpdateNavigationDto,
  ) {
    return this.navigationsService.update(+id, updateNavigationDto);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('orders/update')
  updateOrder(@Body() updateOrderDto: UpdateNavigationOrderDto[]) {
    return this.navigationsService.updateOrder(updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.navigationsService.remove(+id);
  }
}
