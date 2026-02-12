import { Table, Model, Column, DataType } from 'sequelize-typescript';

export enum AnswerType {
  PHONE = 'phone',
  EMAIL = 'email',
  NO_ANSWER = 'no_answer',
}

export enum AppealType {
  APPEAL = 'appeal',
  CLAIM = 'claim',
  CORRUPTION = 'corruption',
}

@Table({
  tableName: 'appeals',
  timestamps: true,
})
export class Appeal extends Model<Appeal> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  full_name?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone?: string;

  @Column({
    type: DataType.ENUM(...Object.values(AnswerType)),
    allowNull: true,
  })
  answer_type?: AnswerType;

  @Column({
    type: DataType.ENUM(...Object.values(AppealType)),
    allowNull: false,
  })
  appeal_type: AppealType;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  text: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  is_checked: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  checked_at?: Date;
}

