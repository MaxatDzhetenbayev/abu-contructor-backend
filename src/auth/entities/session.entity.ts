import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table({
  tableName: 'sessions', // Укажите имя таблицы, если нужно
})
export class Session extends Model<Session> {
  @ApiProperty({ description: 'Session ID' })
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiProperty({ description: 'User ID' })
  @Column(DataType.INTEGER)
  userId: number; // ID пользователя

  @ApiProperty({ description: 'Access JWT Token' })
  @Column(DataType.STRING)
  accessToken: string; // Сохраненный JWT токен

  @ApiProperty({ description: 'Refresh JWT Token' })
  @Column(DataType.STRING)
  refreshToken: string; // Сохраненный Refresh токен

  @ApiProperty({ description: 'Is session active?' })
  @Column({ defaultValue: true })
  active: boolean; // Статус сессии

  @ApiProperty({ description: 'Creation timestamp' })
  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date; // Время создания сессии

  @ApiProperty({ description: 'Update timestamp' })
  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date; // Время последнего обновления сессии
}
