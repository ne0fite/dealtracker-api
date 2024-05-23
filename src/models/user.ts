import {
  Table,
  Column,
  DataType,
  Model,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

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

  @Column(DataType.TEXT)
  email: string;

  @Column(DataType.TEXT)
  password: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
