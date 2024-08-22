import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
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

  findAll() {
    return `This action returns all template`;
  }

  findOne(id: number) {
    return `This action returns a #${id} template`;
  }

  update(id: number, updateTemplateDto: UpdateTemplateDto) {
    return `This action updates a #${id} template`;
  }

  remove(id: number) {
    return `This action removes a #${id} template`;
  }
}
