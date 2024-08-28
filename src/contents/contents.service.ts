import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Content } from './entities/content.entity';

@Injectable()
export class ContentsService {

  logger = new Logger('ContentsService');

  constructor(
    @InjectModel(Content)
    private contentRepository: typeof Content,
  ) { }

  async create(createContentDto: CreateContentDto) {
    try {
      const createdContent =
        await this.contentRepository.create(createContentDto);

      if (!createdContent)
        throw new InternalServerErrorException('Content could not be created');

      return createdContent;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Content could not be created');
    }
  }

  findAll() {
    return `This action returns all contents`;
  }

  async findAllByWidgetId(widget_id: number) {
    try {
      const contents = await this.contentRepository.findAll({
        where: { widget_id },
      });

      if (!contents)
        throw new InternalServerErrorException('Contents could not be finded');

      return contents;
    } catch (error) {
      this.logger.error(`Contents could not be finded`);
      throw new InternalServerErrorException('Contents could not be finded');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} content`;
  }

  async update(id: number, updateContentDto: UpdateContentDto) {
    this.logger.log(`Updating content with id: ${id}`,);
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

      this.logger.error(`Content with id: ${id} could not be updated`);
      throw new InternalServerErrorException('Content could not be updated');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} content`;
  }
}
