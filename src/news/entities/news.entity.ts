import {
  Table,
  Column,
  DataType,
  Model,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';

export enum NewsSource {
  AI = 'ai',
  ABU = 'abu',
  ALL = 'all',
}

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

  @Column({
    type: DataType.ENUM(...Object.values(NewsSource)),
  })
  source: NewsSource;

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

    // Безопасная генерация title_vector с проверкой на null/undefined
    const titleRu = instance.title?.['ru'] || '';
    const titleKz = instance.title?.['kz'] || '';
    const titleEn = instance.title?.['en'] || '';

    instance.title_vector = sequelize.literal(`
      to_tsvector('simple', ${sequelize.escape(titleRu)}) ||
      to_tsvector('simple', ${sequelize.escape(titleKz)}) ||
      to_tsvector('simple', ${sequelize.escape(titleEn)})
    `) as any;

    // Безопасная генерация description_vector с проверкой на null/undefined
    const descRu = instance.content?.['ru']?.description || '';
    const descKz = instance.content?.['kz']?.description || '';
    const descEn = instance.content?.['en']?.description || '';

    instance.description_vector = sequelize.literal(`
      to_tsvector('simple', ${sequelize.escape(descRu)}) ||
      to_tsvector('simple', ${sequelize.escape(descKz)}) ||
      to_tsvector('simple', ${sequelize.escape(descEn)})
    `) as any;
  }
}
