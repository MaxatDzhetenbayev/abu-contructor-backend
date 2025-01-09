import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'auth',
})
export class Auth extends Model<Auth> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  role: string; // 'admin' или 'user'
}
