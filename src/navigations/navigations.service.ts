import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateNavigationDto } from './dto/create-navigation.dto';
import { UpdateNavigationDto } from './dto/update-navigation.dto';
import { Navigation } from './entities/navigation.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Widget } from 'src/widgets/entities/widget.entity';
import { UpdateNavigationOrderDto } from './dto/update-navigation-order';
import { Transaction, where } from 'sequelize';

@Injectable()
export class NavigationsService {
  private readonly logger = new Logger(NavigationsService.name);

  constructor(
    @InjectModel(Navigation)
    private navigationRepository: typeof Navigation,
  ) { }

  async create(createNavigationDto: CreateNavigationDto) {
    try {
      const order = await this.navigationRepository.getnavigationOrder(
        createNavigationDto.parent_id,
      );

      const navigation = await this.navigationRepository.create({
        ...createNavigationDto,
        order,
      });

      if (!navigation)
        throw new InternalServerErrorException(
          'Navigation could not be created',
        );

      return navigation;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Navigation could not be created');
    }
  }

  async findAll() {
    try {
      const navigations = await this.navigationRepository.findAllWithChildren();
      if (!navigations)
        throw new InternalServerErrorException(
          'Navigations could not be finded',
        );

      return navigations;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Navigations could not be finded');
    }
  }

  findOne(id: number) {
    try {
      const navigation = this.navigationRepository.findOne({
        where: { id },
        include: [
          {
            model: Widget,
            as: 'widgets',
          },
        ],
      });

      if (!navigation)
        throw new InternalServerErrorException(
          'Navigation could not be finded',
        );

      return navigation;
    } catch (error) {
      throw new InternalServerErrorException('Navigation could not be finded');
    }
  }

  async findBySlug(slug: string) {
    const slugs = slug.split('/');
    try {
      const findedPage = await this.navigationRepository.findOneBySlug(slugs);
      if (!findedPage)
        throw new InternalServerErrorException(
          'Navigation could not be finded',
        );

      return findedPage;
    } catch (error) {
      throw new InternalServerErrorException('Navigation could not be finded');
    }
  }

  async updateOrder(navigations: UpdateNavigationOrderDto[]) {
    const transaction = await this.navigationRepository.sequelize.transaction();
    this.logger.log('Обновление порядка навигации', { navigations });
    try {
      // Загружаются все навигации, которые будут обновляться
      const navigationIds = navigations.map(nav => nav.id);
      const navigationEntities = await this.navigationRepository.findAll({
        where: { id: navigationIds },
        include: [{ model: Navigation, as: 'children' }],
        transaction,
      });

      // Каждая навигация обновялется
      for (const { id, order, parent_id } of navigations) {
        const navigation = navigationEntities.find(nav => nav.id === id);

        if (parent_id) {
          const parentNavigation = await this.navigationRepository.findByPk(parent_id);
          if (parentNavigation.navigation_type !== 'group') {
            throw new HttpException('Cannot add child navigation to a non-group navigation', HttpStatus.BAD_REQUEST);
          }
        }

        if (!navigation) {
          throw new InternalServerErrorException('Navigation could not be found');
        }

        // Обновляем `parent_id` и `order`, если изменились
        if (navigation.parent_id !== parent_id || navigation.order !== order) {
          navigation.parent_id = parent_id;
          navigation.order = order;
          await navigation.save({ transaction });
        }
      }

      // Пересчитываем порядок для всех элементов на каждом уровне
      const allNavigations = await this.navigationRepository.findAll({
        where: { parent_id: null },
        include: [{ model: Navigation, as: 'children' }],
        order: [['order', 'ASC']],
        transaction,
      });

      await this.navigationRepository.recalculateOrder(allNavigations, transaction);

      await transaction.commit();

      return {
        statusCode: HttpStatus.OK,
        message: 'Navigation order updated successfully',
      }
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      throw new InternalServerErrorException('Navigation could not be updated');
    }
  }


  async update(id: number, updateNavigationDto: UpdateNavigationDto) {
    try {
      const navigation = await this.navigationRepository.findByPk(id);

      if (!navigation)
        throw new InternalServerErrorException(
          'Navigation could not be finded',
        );

      await navigation.update({
        ...updateNavigationDto,
        title: { ...navigation.title, ...updateNavigationDto.title },
      });
      return navigation;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Navigation could not be updated');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} navigation`;
  }
}
