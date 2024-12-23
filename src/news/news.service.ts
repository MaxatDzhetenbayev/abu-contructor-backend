import { HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectModel } from '@nestjs/sequelize';
import { News } from './entities/news.entity';
import { FindOptions, Op } from 'sequelize';

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

  async findAll(limit?: number, offset?: number) {
    const config: FindOptions<News> = {
      order: [['id', 'ASC']],
    }

    if (limit) {
      config['limit'] = limit
    }

    if (offset) {
      config['offset'] = offset
    }

    try {
      const { rows: findedNews, count } = await this.newsRepository.findAndCountAll({
        ...config,
      });

      if (findedNews.length <= 0) {
        throw new InternalServerErrorException('News could not be finded');
      }

      return { items: findedNews, count };
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('News could not be finded');
    }
  }

  async findOne(id: number, direction?: 'prev' | 'next') {

    const where = {}

    if (direction) {
      where['id'] = {
        [Op[direction === 'prev' ? 'lt' : 'gt']]: id
      }
    } else {
      where['id'] = id
    }

    try {
      const findedNews = await this.newsRepository.findOne({ where });
      if (!findedNews) {
        throw new InternalServerErrorException('News could not be finded');
      }

      await findedNews.increment('viewCount', { by: 1 });

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
