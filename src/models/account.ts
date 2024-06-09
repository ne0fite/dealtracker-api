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
  tableName: 'account',
})
export default class Account extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
  })
  id: string;

  @Column(DataType.TEXT)
  firstName: string;

  @Column(DataType.TEXT)
  lastName: string;

  @Column(DataType.TEXT)
  csToken: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
