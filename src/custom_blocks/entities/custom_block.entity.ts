import { Column, DataType, Model, Table } from "sequelize-typescript";



export interface CustomBlockContent {
    [key: string]: any
}


@Table({
    modelName: "custom_blocks",
    timestamps: true
})
export class CustomBlock extends Model<CustomBlock> {


    @Column({
        primaryKey: true
    })
    id: number;

    @Column
    navigation_slug: string

    @Column
    title: string;

    @Column({
        type: DataType.JSONB,
    })
    content: CustomBlockContent
}
