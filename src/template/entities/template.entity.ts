import { DataTypes } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';

@Table({
    tableName: 'templates',
    timestamps: true,
})



export class Template extends Model<Template> {
    @Column
    title: string;

    @Column({ type: DataTypes.ARRAY(DataTypes.STRING) })
    widgets: string[];
}