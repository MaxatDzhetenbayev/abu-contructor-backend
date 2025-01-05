import { Table, Column, DataType, Model } from 'sequelize-typescript';

@Table({ tableName: 'news', timestamps: true })
export class News extends Model<News> {
  @Column({
    type: DataType.JSONB,
  })
  title: {
    [key: string]: any;
  };

  @Column({
    type: DataType.JSONB,
  })
  content: {
    [key: string]: any;
  };

  @Column
  viewCount: number;
}
