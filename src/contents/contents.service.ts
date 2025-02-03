import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Content } from './entities/content.entity';
import { UpdateContentOrderDto } from './dto/update-content-order.dto';
import { WidgetsService } from 'src/widgets/widgets.service';
import * as fs from 'fs';
import path from 'path';
@Injectable()
export class ContentsService {
  logger = new Logger('ContentsService');

  constructor(
    @InjectModel(Content)
    private contentRepository: typeof Content,
    private widgetsService: WidgetsService,
  ) {}

  async create(createContentDto: CreateContentDto) {
    try {
      const widget = await this.widgetsService.findOneWithContents(
        createContentDto.widget_id,
      );
      console.log(widget);
      const createdContent = await this.contentRepository.create({
        ...createContentDto,
        order: widget.contents.length + 1,
      });

      if (!createdContent)
        throw new InternalServerErrorException('Content could not be created');

      return createdContent;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Content could not be created');
    }
  }

  async findAll() {
    try {
      const contents = await this.contentRepository.findAll();
      return contents;
    } catch (error) {
      this.logger.error(`Contents could not be finded`);
      throw new InternalServerErrorException('Contents could not be finded');
    }
  }

  async findAllByWidgetId(widget_id: number) {
    try {
      const contents = await this.contentRepository.findAll({
        where: { widget_id },
        order: [['order', 'ASC']],
      });

      if (!contents)
        throw new InternalServerErrorException('Contents could not be finded');

      return contents;
    } catch (error) {
      this.logger.error(`Contents could not be finded`);
      throw new InternalServerErrorException('Contents could not be finded');
    }
  }

  async findOne(id: number) {
    try {
      const content = await this.contentRepository.findByPk(id);

      if (!content)
        throw new InternalServerErrorException('Content could not be finded');

      return content;
    } catch (error) {
      this.logger.error(
        `Content with id: ${id} could not be finded. Error: ${error}`,
      );
      throw new InternalServerErrorException('Content could not be finded');
    }
  }

  async update(id: number, updateContentDto: UpdateContentDto) {
    this.logger.log(`Updating content with id: ${id}`);
    try {
      const content = await this.contentRepository.findByPk(id);

      if (!content)
        throw new InternalServerErrorException('Content could not be finded');

      await content.update({
        content: { ...content.content, ...updateContentDto.content },
        options: { ...content.options, ...updateContentDto.options },
      });
      this.logger.log(`Content with id: ${id} updated`);
    } catch (error) {
      this.logger.error(
        `Content with id: ${id} could not be updated, error: ${error}`,
      );
      throw new InternalServerErrorException('Content could not be updated');
    }
  }

  async remove(id: number) {
    try {
      const findedItem = await this.contentRepository.findByPk(id);

      if (!findedItem)
        throw new InternalServerErrorException('Content could not be finded');

      await findedItem.destroy();

      if (!findedItem) {
        throw new InternalServerErrorException('Content could not be deleted');
      }

      return {
        message: 'Content deleted successfully',
      };
    } catch (error) {
      this.logger.error(
        `Content with id: ${id} could not be deleted, error: ${error} `,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Content could not be deleted');
    }
  }

  async updateOrder(widgetOrders: UpdateContentOrderDto[]) {
    const transaction = await this.contentRepository.sequelize.transaction();
    this.logger.log('Обновление порядка контента', { widgetOrders });
    try {
      const widgetsIds = widgetOrders.map((widget) => widget.id);
      const widgetEntities = await this.contentRepository.findAll({
        where: { id: widgetsIds },
        transaction,
      });

      for (const { id, order } of widgetOrders) {
        const widgetEntity = widgetEntities.find((widget) => widget.id === id);

        if (!widgetEntity) {
          throw new InternalServerErrorException('Content could not be found');
        }

        widgetEntity.order = order;
        await widgetEntity.save({ transaction });
      }

      await transaction.commit();

      return {
        statusCode: HttpStatus.OK,
        message: 'Contents order updated successfully',
      };
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      throw new InternalServerErrorException('Contents could not be updated');
    }
  }
}
