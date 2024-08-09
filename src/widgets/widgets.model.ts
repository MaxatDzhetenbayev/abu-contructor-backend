import { DataTypes } from "sequelize";
import { Table, Column, Model, ForeignKey, DataType, BelongsTo, HasMany } from "sequelize-typescript";
import { Content } from "src/contents/contents.model";
import { Navigation } from "src/navigations/navigations.model";



@Table({
    tableName: 'widgets',
    timestamps: true,
})
export class Widget extends Model<Widget> {

    @Column
    widget_type: string;

    @Column({
        type: DataTypes.JSONB
    })
    options: { [key: string]: any };

    @Column
    order: number;

    @ForeignKey(() => Navigation)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    navigation_id: number;

    @BelongsTo(() => Navigation)
    navigation: Navigation;

    @HasMany(() => Content)
    contents: Content[];
}