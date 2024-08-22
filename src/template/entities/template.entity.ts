import { DataTypes } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';

@Table({
    tableName: 'templates',
    timestamps: true,
})
export class Template extends Model<Template> {
    @Column
    name: string;

    @Column({ type: DataTypes.ARRAY(DataTypes.STRING) })
    widgets_list: string[];
}