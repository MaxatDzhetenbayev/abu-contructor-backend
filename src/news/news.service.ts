import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectModel } from '@nestjs/sequelize';
import { News } from './entities/news.entity';
import sequelize, { FindOptions, Op } from 'sequelize';
import * as path from 'path';
import * as fs from 'fs';
import { FindQueriesDto } from './dto/find-queries.dto';

@Injectable()
export class NewsService {
  logger = new Logger('NewsService');

  constructor(
    @InjectModel(News)
    private newsRepository: typeof News,
  ) {}

  async create(
    createNewsDto: CreateNewsDto,
    files: { [key: string]: Express.Multer.File[] },
  ) {
    try {
      const normalFiles = { ...files };

      for (const lang_files in normalFiles) {
        createNewsDto.content[lang_files].images = normalFiles[lang_files].map(
          (file) => file.filename,
        );
      }

      const createdNews = await this.newsRepository.create(createNewsDto);

      if (!createdNews)
        throw new InternalServerErrorException('News could not be created');

      return createdNews;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('News could not be created');
    }
  }

  async findAll(queries: FindQueriesDto) {
    const { offset, query, limit, startDate, endDate } = queries;
    const config: FindOptions<News> = {
      order: [['id', 'DESC']],
    };

    if (limit) config.limit = limit;
    if (offset) config.offset = offset;
    if (query)
      config.where = {
        ...config.where,
        [Op.or]: [
          {
            title_vector: {
              [Op.match]: sequelize.literal(
                `to_tsquery('simple', '${query}:*')`,
              ),
            },
          },
          {
            description_vector: {
              [Op.match]: sequelize.literal(
                `to_tsquery('simple', '${query}:*')`,
              ),
            },
          },
        ],
      };

    if (startDate && !endDate) {
      const date = new Date(startDate).toISOString();
      const startOfDay = new Date(date).setHours(0, 0, 0, 0);
      const endOfDay = new Date(date).setHours(23, 59, 59, 999);

      config.where = {
        ...config.where,
        createdAt: {
          [Op.between]: [startOfDay, endOfDay],
        },
      };
    } else if (startDate && endDate) {
      const endOfDayDate = new Date(endDate).setHours(23, 59, 59, 999);

      config.where = {
        ...config.where,
        createdAt: {
          [Op.between]: [startDate, endOfDayDate],
        },
      };
    }

    try {
      const { rows: findedNews, count } =
        await this.newsRepository.findAndCountAll({
          ...config,
        });

      if (findedNews.length <= 0) {
        return [];
      }

      return { items: findedNews, count };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('News could not be finded');
    }
  }

  async findOne(id: number, direction?: 'prev' | 'next') {
    const where = {};

    if (direction) {
      where['id'] = {
        [Op[direction === 'prev' ? 'lt' : 'gt']]: id,
      };
    } else {
      where['id'] = id;
    }

    try {
      const findedNews = await this.newsRepository.findOne({ where });
      if (!findedNews) {
        throw new InternalServerErrorException('News could not be finded');
      }

      await findedNews.increment('viewCount', { by: 1 });

      return findedNews;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('News could not be finded');
    }
  }

  async update(id: number, updateNewsDto: UpdateNewsDto) {
    try {
      const findedNews = await this.newsRepository.findByPk(id);

      if (!findedNews) {
        throw new InternalServerErrorException('News could not be updated');
      }

      await findedNews.update(updateNewsDto);

      return findedNews;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('News could not be updated');
    }
  }

  async remove(id: number) {
    try {
      const findedNews = await this.newsRepository.findByPk(id);

      if (!findedNews) {
        throw new InternalServerErrorException(
          `News with ${id} could not be finded`,
        );
      }

      const images = Object.values(findedNews.content)
        .map((content) => content.images)
        .flat();

      if (images.length) {
        images.forEach((imagePath) => {
          const fullPath = path.join(
            __dirname,
            '..',
            '..',
            'uploads',
            path.basename(imagePath),
          );
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });
      }

      await findedNews.destroy();

      return {
        statusCode: HttpStatus.OK,
        message: 'Content deleted successfully',
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('News could not be deleted');
    }
  }
}
