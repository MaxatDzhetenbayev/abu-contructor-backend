import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateNavigationDto } from './dto/create-navigation.dto';
import { UpdateNavigationDto } from './dto/update-navigation.dto';
import { Navigation } from './entities/navigation.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class NavigationsService {
  constructor(
    @InjectModel(Navigation)
    private navigationRepository: typeof Navigation,
  ) {}

  async create(createNavigationDto: CreateNavigationDto) {
    try {
      const navigation = await this.navigationRepository.create({
        title: createNavigationDto.title,
        slug: createNavigationDto.slug,
        order: createNavigationDto.order,
        parent_id: createNavigationDto.parent_id,
        navigation_type: createNavigationDto.navigation_type,
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
      console.log(navigations);
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
    return `This action returns a #${id} navigation`;
  }

  // slug example: 'about-us/structure/maxat_dzhetenbaev'
  async findBySlug(slug: string) {
    const slugs = slug.split('/');
    try {
      const findedPage = this.navigationRepository.findOneBySlug(slugs);

      if (!findedPage)
        throw new InternalServerErrorException(
          'Navigation could not be finded',
        );

      return findedPage;
    } catch (error) {
      throw new InternalServerErrorException('Navigation could not be finded');
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
