import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateOrderDto } from './dto/update-template-order.dto';
import { Template } from './entities/template.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class TemplateService {

  logger = new Logger('TemplateService');

  constructor(
    @InjectModel(Template)
    private templateRepository: typeof Template,
  ) { }

  async create(createTemplateDto: CreateTemplateDto) {
    try {
      this.logger.log('Создание нового шаблона', { createTemplateDto });
      const createdTemplate = await this.templateRepository.create(createTemplateDto);

      if (!createdTemplate) {
        throw new Error('Template not created');
      }

      this.logger.log(`Теплейт с id: ${createdTemplate.id} создан успешно`);
      return createdTemplate;

    } catch (error) {

      console.log(error);
      throw new InternalServerErrorException('Templte could not be created');

    }
  }

  async findByTitle(title: string) {
    try {
      const template = await this.templateRepository.findOne({
        where: {
          title: title
        }
      });

      if (!template) {
        throw new InternalServerErrorException('Templates could not be found');
      }

      return template;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Templates could not be found');
    }
  }
  async findAll() {

    try {
      const templates = await this.templateRepository.findAll();

      if (!templates) {
        throw new InternalServerErrorException('Templates could not be found');
      }

      return templates;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Templates could not be found');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} template`;
  }

  async updateOrder(id: number, updateTemplateDto: UpdateTemplateOrderDto) {
    this.logger.log('Обновление порядка шаблонов', { updateTemplateDto });

    try {

      const templateEntities = await this.templateRepository.findAll();

      const draggedEntity = templateEntities.find((template) => template.id === id);

      if (!draggedEntity) {
        throw new InternalServerErrorException('Template could not be found');
      }

    } catch (error) {

      console.log(error);
      throw new InternalServerErrorException('Templte could not be updated');

    }
  }

  remove(id: number) {
    return `This action removes a #${id} template`;
  }
}
