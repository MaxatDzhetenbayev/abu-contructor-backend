import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Widget } from './widgets.model';

@Injectable()
export class WidgetsService {

  constructor(
    @InjectModel(Widget)
    private widgetRepository: typeof Widget
  ) { }

  async create(createWidgetDto: CreateWidgetDto) {
    try {

      const createdWidget = await this.widgetRepository.create(
        createWidgetDto
      )

      if (!createdWidget) {
        throw new InternalServerErrorException('Error creating widget')
      }

      return createdWidget

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Error creating widget')
    }

  }

  findAll() {
    return `This action returns all widgets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} widget`;
  }

  update(id: number, updateWidgetDto: UpdateWidgetDto) {
    return `This action updates a #${id} widget`;
  }

  remove(id: number) {
    return `This action removes a #${id} widget`;
  }
}
