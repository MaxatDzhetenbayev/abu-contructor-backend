import sequelize from 'sequelize';
import { DataTypes, Transaction } from 'sequelize';
import { BelongsTo, Column, HasMany, Model, Table } from 'sequelize-typescript';
import { Content } from 'src/contents/entities/content.entity';
import { Widget } from 'src/widgets/entities/widget.entity';

@Table({
  tableName: 'navigations',
  timestamps: true,
})
export class Navigation extends Model {
  @Column({ type: DataTypes.JSONB })
  title: { [key: string]: string };

  @Column
  slug: string;

  @Column
  navigation_type: string;

  @Column
  order: number;

  @Column
  parent_id: number | null;

  @HasMany(() => Navigation, 'parent_id')
  children: Navigation[];

  @BelongsTo(() => Navigation, 'parent_id')
  parent: Navigation;

  @HasMany(() => Widget)
  widgets: Widget[];

  static createTree(navigations: Navigation[], parent_id = null) {
    return navigations
      .filter((navigation) => navigation.parent_id === parent_id)
      .map((navigation) => ({
        ...navigation,
        children: this.createTree(navigations, navigation.id),
      }))
      .sort((a, b) => a.order - b.order);
  }

  static async findAllWithChildren() {
    const navigations = await this.findAll({
      include: [
        {
          model: Navigation,
          as: 'children',
          include: [
            {
              model: Navigation,
              as: 'children',
            },
          ],
        },
      ],
      order: [['order', 'ASC']],
    });

    const sortChildren = (navigation) => {
      if (navigation.children) {
        navigation.children.sort((a, b) => a.order - b.order);
        navigation.children.forEach(sortChildren);
      }
    };

    navigations.forEach(sortChildren);

    return navigations.filter((navigation) => navigation.parent_id === null);
  }

  static async findOneWithChildren(id: number) {
    const navigation = await this.findByPk(id, {
      include: [
        {
          model: Navigation,
          as: 'children',
          include: [{ model: Navigation, as: 'children' }],
        },
      ],
      order: [
        ['order', 'ASC'],
        [{ model: Navigation, as: 'children' }, 'order', 'ASC'],
      ],
    });

    return navigation;
  }

  static async getnavigationOrder(parent_id?: number | undefined) {
    if (parent_id) {
      const navigation = await this.findOneWithChildren(parent_id);
      return navigation.children.length + 1;
    }
    const navigations = await this.findAllWithChildren();
    return navigations.length + 1;
  }

  static async findOneBySlug(slugs: string[]) {
    let currentId: number | null = null;
    let foundPage: Navigation | null = null;

    try {
      for (const slug of slugs) {
        foundPage = await this.findOne({
          where: {
            slug: slug,
            parent_id: currentId,
          },
        });

        if (!foundPage) {
          return null;
        }

        currentId = foundPage.id;
      }

      const currentpage = await this.findOne({
        where: {
          id: currentId,
        },
        include: [
          {
            model: Widget,
            as: 'widgets',
            include: [
              {
                model: Content,
                as: 'contents',
              },
            ],
          },
        ],
        order: [
          [{ model: Widget, as: 'widgets' }, 'order', 'ASC'],
          [
            { model: Widget, as: 'widgets' },
            { model: Content, as: 'contents' },
            'order',
            'ASC',
          ],
        ],
      });

      return currentpage;
    } catch (error) {
      console.log(error);
    }
  }

  static async recalculateOrder(
    navigations: Navigation[],
    transaction: Transaction,
  ) {
    let orderCounter = 1;

    for (const navigation of navigations) {
      navigation.order = orderCounter++;
      await navigation.save({ transaction });
    }
  }
}
