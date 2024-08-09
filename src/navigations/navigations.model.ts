import { DataTypes } from "sequelize";
import { BelongsTo, Column, HasMany, Model, Table } from "sequelize-typescript";
import { Content } from "src/contents/contents.model";
import { Widget } from "src/widgets/widgets.model";


@Table({
    tableName: 'navigations',
    timestamps: true
})
export class Navigation extends Model {
    @Column({ type: DataTypes.JSONB })
    title: { [key: string]: string };

    @Column
    slug: string;

    @Column
    order: number;

    @Column
    navigation_type: string;

    @Column
    parent_id: number | null;

    @HasMany(() => Navigation, 'parent_id')
    children: Navigation[];

    @BelongsTo(() => Navigation, 'parent_id')
    parent: Navigation

    @HasMany(() => Widget)
    widgets: Widget[]


    static async findAllWithChildren() {
        const navigations = await this.findAll({
            include: [
                {
                    model: Navigation,
                    as: 'children',
                    include: [{ model: Navigation, as: 'children' }],
                }
            ]
        })

        return navigations.filter(navigation => navigation.parent_id === null)
    }

    static async findOneBySlug(slugs: string[]) {

        let currentParentId: number | null = null;
        let foundPage: Navigation | null = null;

        for (const slug of slugs) {
            foundPage = await this.findOne({
                where: {
                    slug: slug,
                    parent_id: currentParentId
                },
            });

            if (!foundPage) {
                return null;
            }

            currentParentId = foundPage.id;
        }

        const currentpage = await this.findOne({
            where: {
                id: currentParentId
            },
            include: [{
                model: Widget,
                as: 'widgets',
                include: [{
                    model: Content,
                    as: 'contents'
                }]
            }]
        })

        return currentpage
    }

}