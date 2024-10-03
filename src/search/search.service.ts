import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UpdateSearchDto } from './dto/update-search.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Navigation } from 'src/navigations/entities/navigation.entity';
import { Widget } from 'src/widgets/entities/widget.entity';
import sequelize from 'sequelize';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Navigation) private navigationModel: typeof Navigation,
    @InjectModel(Widget) private widgetModel: typeof Widget,
  ) {}

  logger = new Logger('SearchService');

  async findByQueryString(query: string, local: string) {
    try {
      const navigations = await this.navigationModel.findAll({
        where: {
          slug: { [sequelize.Op.not]: 'group' },
          [sequelize.Op.and]: sequelize.where(
            sequelize.literal(`Lower(title->>'${local}')`),
            { [sequelize.Op.iLike]: `%${query.toLowerCase()}%` },
          ),
        },
      });

      const widgets = await this.widgetModel.findAll({
        where: {
          [sequelize.Op.and]: sequelize.where(
            sequelize.literal(`Lower(options->'title'->>'${local}')`),
            { [sequelize.Op.iLike]: `%${query.toLowerCase()}%` },
          ),
        },
        attributes: ['options'],
        include: [
          {
            model: Navigation,
            as: 'navigation',
            attributes: ['slug'],
          },
        ],
      });

      const result = [...navigations, ...widgets];

      return result;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error finding search');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} search`;
  }

  update(id: number, updateSearchDto: UpdateSearchDto) {
    return `This action updates a #${id} search`;
  }

  remove(id: number) {
    return `This action removes a #${id} search`;
  }
}
