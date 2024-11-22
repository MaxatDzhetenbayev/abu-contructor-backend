import { HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectModel } from '@nestjs/sequelize';
import { News } from './entities/news.entity';

@Injectable()
export class NewsService {
  logger = new Logger('NewsService');

  constructor(
    @InjectModel(News)
    private newsRepository: typeof News,
  ) { }

  async create(createNewsDto: CreateNewsDto) {
    try {
      const createdNews = await this.newsRepository.create(createNewsDto);

      if (!createdNews)
        throw new InternalServerErrorException('News could not be created');

      return createdNews;
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('News could not be created');
    }
  }

  async findAll() {
    try {
      const findedNews = await this.newsRepository.findAll();

      if (findedNews.length <= 0) {
        throw new InternalServerErrorException('News could not be finded');
      }

      return findedNews;
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('News could not be finded');
    }
  }

  async findOne(id: number) {
    try {
      const findedNews = await this.newsRepository.findByPk(id);

      if (!findedNews) {
        throw new InternalServerErrorException('News could not be finded');
      }

      return findedNews;
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('News could not be finded');
    }
  }

  async update(id: number, updateNewsDto: UpdateNewsDto) {
    try {
      const findedNews = await this.newsRepository.findByPk(id);

      if (!findedNews) {
        throw new InternalServerErrorException('News could not be updated');
      }

      await findedNews.update(updateNewsDto)

      return findedNews;
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('News could not be updated');
    }
  }

  async remove(id: number) {
    try {
      const findedNews = await this.newsRepository.findByPk(id);

      if (!findedNews) {
        throw new InternalServerErrorException(`News with ${id} could not be finded`);
      }

      await findedNews.destroy()

      return {
        statusCode: HttpStatus.OK,
        message: 'Content deleted successfully',
      };
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('News could not be deleted');
    }
  }
}
