import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Content } from './entities/content.entity';

@Injectable()
export class ContentsService {
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
      console.log(error);
      throw new InternalServerErrorException('Contents could not be finded');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} content`;
  }

  update(id: number, updateContentDto: UpdateContentDto) {
    return `This action updates a #${id} content`;
  }

  remove(id: number) {
    return `This action removes a #${id} content`;
  }
}
