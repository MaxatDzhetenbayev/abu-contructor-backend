import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppealsService } from './appeals.service';
import { CreateAppealDto } from './dto/create-appeal.dto';
import { FindAppealsDto } from './dto/find-appeals.dto';

@Controller('appeals')
export class AppealsController {
  constructor(private readonly appealsService: AppealsService) {}

  @Post()
  create(@Body() dto: CreateAppealDto) {
    return this.appealsService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindAppealsDto) {
    return this.appealsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appealsService.findOne(+id);
  }
}

