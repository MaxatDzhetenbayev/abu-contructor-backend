import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateNavigationDto } from './dto/create-navigation.dto';
import { UpdateNavigationDto } from './dto/update-navigation.dto';
import { Navigation } from './entities/navigation.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Widget } from 'src/widgets/entities/widget.entity';
import { UpdateNavigationOrderDto } from './dto/update-navigation-order';
import { where } from 'sequelize';

@Injectable()
export class NavigationsService {
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
    console.log(navigations);
    try {
      for (const { id, order, parent_id } of navigations) {
        const navigation = await this.navigationRepository.findByPk(id);
        if (!navigation)
          throw new InternalServerErrorException(
            'Navigation could not be finded',
          );

        if (parent_id === undefined) {
          await navigation.update({ order });
        }
        else {
          const parentNavigation = await this.navigationRepository.findOneWithChildren(parent_id)
          // if (parentNavigation && parentNavigation.children.length === 0) {
          //   await navigation.update({ order: 1, parent_id })
          // } 
          // else {
          const updatedNavigation = await navigation.update({ order, parent_id })
          console.log(updatedNavigation.dataValues)
          // parentNavigation.children.forEach(async (child) => {
          //   console.log(child);
          // await child.update({ order: )
          // })

          // if (updatedNavigation.parent_id === null) {
          //   const navigationLevel1 = await this.navigationRepository.findAllWithChildren();
          //   navigationLevel1.forEach(async (nav) => {
          //     if (nav.order >= order && nav.id !== updatedNavigation.id) {
          //       await nav.update({ order: nav.order + 1 })
          //     }
          //   })
          // }

          parentNavigation.children.forEach(async (child) => {
            if (child.order >= order) {
              await child.update({ order: child.order + 1 })
            }
          })
          // }
        }
      }
    } catch (error) {
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
