import {
  Table,
  Column,
  DataType,
  Model,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
} from 'sequelize-typescript';
import Account from './account';

@Table({
  timestamps: true,
  underscored: true,
  tableName: 'user',
})
export default class User extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
  })
  id: string;

  @ForeignKey(() => Account)
  @Column(DataType.UUID)
  accountId: string;

  @Column(DataType.TEXT)
  email: string;

  @Column(DataType.TEXT)
  password: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
