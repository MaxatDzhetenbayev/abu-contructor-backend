import {
  Table,
  Model,
  Column,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { Widget } from 'src/widgets/entities/widget.entity';

@Table({
  tableName: 'contents',
  timestamps: true,
})
export class Content extends Model<Content> {
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  content: {
    [key: string]: Object;
  };

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  options: {
    [key: string]: any;
  };

  @ForeignKey(() => Widget)
  @Column
  widget_id: number;

  @BelongsTo(() => Widget)
  widget: Widget;
}
