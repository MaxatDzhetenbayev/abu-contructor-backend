import { Table, Column, Model } from 'sequelize-typescript';


@Table({ tableName: 'news', timestamps: true })
export class News {
    @Column
    title: string;

    @Column
    content: string;


    

    @Column
    images: string[];
}
