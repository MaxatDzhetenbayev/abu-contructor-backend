import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Widget } from './entities/widget.entity';
import { NavigationsService } from 'src/navigations/navigations.service';
import { UpdateWidgetOrderDto } from './dto/update-widget-order';
import { Content } from 'src/contents/entities/content.entity';

@Injectable()
export class WidgetsService {
  constructor(
    @InjectModel(Widget)
    private widgetRepository: typeof Widget,
    private navigationsService: NavigationsService,
  ) {}
  private readonly logger = new Logger(WidgetsService.name);

  async create(createWidgetDto: CreateWidgetDto) {
    this.logger.log('Создание виджета', { createWidgetDto });

    try {
      const navigation = await this.navigationsService.findOne(
        createWidgetDto.navigation_id,
      );

      const createdWidget = await this.widgetRepository.create({
        ...createWidgetDto,
        order: navigation.widgets.length + 1,
      });

      if (!createdWidget) {
        throw new InternalServerErrorException('Error creating widget');
      }

      return createdWidget;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error creating widget');
    }
  }

  async updateOrder(widgetOrders: UpdateWidgetOrderDto[]) {
    const transaction = await this.widgetRepository.sequelize.transaction();
    this.logger.log('Обновление порядка виджетов', { widgetOrders });
    try {
      const widgetsIds = widgetOrders.map((widget) => widget.id);
      const widgetEntities = await this.widgetRepository.findAll({
        where: { id: widgetsIds },
        transaction,
      });

      for (const { id, order } of widgetOrders) {
        const widgetEntity = widgetEntities.find((widget) => widget.id === id);

        if (!widgetEntity) {
          throw new InternalServerErrorException('Widget could not be found');
        }

        widgetEntity.order = order;
        await widgetEntity.save({ transaction });
      }

      await transaction.commit();

      return {
        statusCode: HttpStatus.OK,
        message: 'Widgets order updated successfully',
      };
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      throw new InternalServerErrorException('Widgets could not be updated');
    }
  }

  async findByNavigationId(navigation_id: number) {
    try {
      const widgets = await this.widgetRepository.findAll({
        where: { navigation_id },
        order: [['order', 'ASC']],
        attributes: ['id', 'widget_type', 'options', 'order'],
        include: [
          {
            model: Content,
            as: 'contents',
            attributes: ['id', 'content', 'options'],
          },
        ],
      });

      if (!widgets)
        throw new InternalServerErrorException('Widgets could not be found');

      return widgets;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Widgets could not be found');
    }
  }

  findAll() {
    return `This action returns all widgets`;
  }

  findOne(id: number) {
    try {
      const widget = this.widgetRepository.findByPk(id);

      if (!widget)
        throw new InternalServerErrorException('Widget could not be found');

      return widget;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Widget could not be found');
    }
  }

  findOneWithContents(id: number) {
    try {
      const widget = this.widgetRepository.findByPk(id, {
        include: [
          {
            model: Content,
            as: 'contents',
          },
        ],
      });

      if (!widget)
        throw new InternalServerErrorException('Widget could not be found');

      return widget;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Widget could not be found');
    }
  }

  async update(id: number, updateWidgetDto: UpdateWidgetDto) {
    this.logger.log('Обновление виджета', { id, updateWidgetDto });

    try {
      const widget = await this.widgetRepository.findByPk(id);

      if (!widget)
        throw new InternalServerErrorException('Widget could not be found');

      widget.update(updateWidgetDto);

      return widget;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Widget could not be updated');
    }
  }

  async remove(id: number) {
    try {
      const widget = await this.widgetRepository.findByPk(id);

      if (!widget)
        throw new InternalServerErrorException('Widget could not be found');

      await widget.destroy();

      return {
        statusCode: HttpStatus.OK,
        message: 'Widget removed successfully',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Widget could not be removed');
    }
  }
}
