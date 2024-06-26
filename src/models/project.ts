import {
  Table,
  Column,
  DataType,
  Model,
  CreatedAt,
  UpdatedAt,
  HasMany,
  ForeignKey,
} from 'sequelize-typescript';

import Deal from './deal';
import Account from './account';

@Table({
  timestamps: true,
  underscored: true,
  tableName: 'project',
})
export default class Project extends Model {
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
  name: string;

  @Column(DataType.DOUBLE)
  goal: number = 0;

  @Column(DataType.TEXT)
  strategy: string;

  @Column(DataType.TEXT)
  notes: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasMany(() => Deal)
  deals: Deal[];
}
