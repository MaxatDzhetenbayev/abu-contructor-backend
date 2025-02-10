import {
  Table,
  Column,
  DataType,
  Model,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';

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

  @Column({ defaultValue: 0 })
  viewCount: number;

  @Column({ type: DataType.TSVECTOR })
  title_vector: string;

  @Column({ type: DataType.TSVECTOR })
  description_vector: string;

  @BeforeCreate
  @BeforeUpdate
  static async updateVectors(instance: News) {
    const sequelize = instance.sequelize;

    instance.title_vector = sequelize.literal(`
		to_tsvector('simple', '${instance.title['ru']}') ||
		to_tsvector('simple', '${instance.title['kz']}') ||
		to_tsvector('simple', '${instance.title['en']}')
		`) as any;

    instance.description_vector = sequelize.literal(`
		to_tsvector('simple', '${instance.content['ru']?.description}') ||
		to_tsvector('simple', '${instance.content['kz']?.description}') ||
		to_tsvector('simple', '${instance.content['en']?.description}')
		`) as any;
  }
}
