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
  tableName: 'coinbase_product',
})
export default class CoinbaseProduct extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
  })
  id: string;

  @Column(DataType.DOUBLE)
  base_currency: string;

  @Column(DataType.DOUBLE)
  quote_currency: string;

  @Column(DataType.DOUBLE)
  quote_increment: number;

  @Column(DataType.DOUBLE)
  base_increment: number;

  @Column(DataType.TEXT)
  display_name: string;

  @Column(DataType.DOUBLE)
  min_market_funds: number;

  @Column(DataType.BOOLEAN)
  margin_enabled: boolean;

  @Column(DataType.BOOLEAN)
  post_only: boolean;

  @Column(DataType.BOOLEAN)
  limit_only: boolean;

  @Column(DataType.BOOLEAN)
  cancel_only: boolean;

  @Column(DataType.TEXT)
  status: string;

  @Column(DataType.TEXT)
  status_message: string;

  @Column(DataType.BOOLEAN)
  auction_mode: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
