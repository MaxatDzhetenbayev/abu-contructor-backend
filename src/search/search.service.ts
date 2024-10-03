import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Navigation } from 'src/navigations/entities/navigation.entity';
import { Widget } from 'src/widgets/entities/widget.entity';
import sequelize from 'sequelize';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Navigation) private navigationModel: typeof Navigation,
    @InjectModel(Widget) private widgetModel: typeof Widget,
  ) { }

  logger = new Logger('SearchService');

  async findByQueryString(query: string, locale: string) {
    try {


      const [navigations, widgets] = await Promise.all([
        // Поиск навигации по query параметру
        this.navigationModel.findAll({
          where: {
            slug: { [sequelize.Op.not]: 'group' },
            [sequelize.Op.and]: sequelize.where(
              sequelize.literal(`Lower(title->>'${locale}')`),
              { [sequelize.Op.iLike]: `%${query.toLowerCase()}%` },
            ),
          },
        }),
        // Поиск виджетов по query параметру
        this.widgetModel.findAll({
          where: sequelize.where(
            sequelize.literal(`LOWER(options->'content'->'${locale}'->>'title')`),
            { [sequelize.Op.iLike]: `%${query.toLowerCase()}%` }
          ),
          attributes: ['options', 'order'],
          include: [
            {
              model: Navigation,
              as: 'navigation',
              attributes: ['id', 'slug'],
            },
          ],
        }),
      ])

      // Добавление полного slug к найденным навигациям и виджетам
      const result = await Promise.all([
        ...navigations.map(async (navigation) => {
          const slug = await this.getParentNavigationSlug(navigation.id);
          navigation.setDataValue('slug', slug.reverse().join('/'));
          navigation.setDataValue('type', 'navigation');
          return navigation;
        }),
        ...widgets.map(async (widget) => {
          const slug = await this.getParentNavigationSlug(widget.navigation.id);
          widget.navigation.setDataValue('slug', slug.reverse().join('/'));
          widget.navigation.setDataValue('type', 'widget');
          return widget;
        }),
      ])

      return result;
      // return [...navigations, ...widgets];
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error finding search');
    }
  }

  async getParentNavigationSlug(id: number) {

    const slug: string[] = []

    let navigation = await this.navigationModel.findByPk(id);

    while (navigation) {
      slug.push(navigation.slug);
      if (navigation.parent_id) {
        navigation = await this.navigationModel.findByPk(navigation.parent_id);
      } else {
        break;
      }
    }

    return slug;
  }
}
