import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { InjectModel } from '@nestjs/sequelize';
import { News, NewsSource } from './entities/news.entity';
import sequelize, { FindOptions, Op } from 'sequelize';
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

      const createdNews = await this.newsRepository.create({
        ...createNewsDto,
        createdAt: createNewsDto.createdAt || new Date().toISOString(),
      });

      if (!createdNews)
        throw new InternalServerErrorException('News could not be created');

      return createdNews;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('News could not be created');
    }
  }

  async findAll(queries: FindQueriesDto) {
    const { offset, query, limit, lang, startDate, endDate, source } = queries;
    const config: FindOptions<News> = {
      order: [['id', 'DESC']],
    };

    if (limit) config.limit = limit;
    if (offset) config.offset = offset;

    if (lang) {
      config.where = {
        ...config.where,
        [Op.and]: [
          sequelize.literal(`NULLIF(BTRIM(title->>'${lang}'), '') IS NOT NULL`),
        ],
      };
    }

    if (source && source == NewsSource.ABU) {
      config.where = {
        ...config.where,
        source: NewsSource.ABU,
      };
    } else if (source && source == NewsSource.AI) {
      config.where = {
        ...config.where,
        source: {
          [Op.not]: NewsSource.ABU,
        },
      };
    }

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

  async update(
    id: number,
    updateDto: CreateNewsDto,
    files: { [key: string]: Express.Multer.File[] },
    imagesToKeep: { [lang: string]: string[] },
  ) {
    const news = await this.newsRepository.findByPk(id);
    if (!news) throw new NotFoundException('Новость не найдена');

    for (const lang of ['kz', 'ru', 'en']) {
      const keepImages = imagesToKeep?.[lang] || [];

      const newFiles = files?.[lang] || [];
      const newImageNames = newFiles.map((f) => f.filename);

      // Обновляем массив изображений
      updateDto.content[lang].images = [...keepImages, ...newImageNames];
    }

    // Обновление в базе
    const updated = await this.newsRepository.update(updateDto, {
      where: { id },
      returning: true,
    });

    if (!updated)
      throw new InternalServerErrorException('Could not update news');

    return updated;
  }

  async remove(id: number) {
    try {
      const findedNews = await this.newsRepository.findByPk(id);

      if (!findedNews) {
        throw new InternalServerErrorException(
          `News with ${id} could not be finded`,
        );
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
