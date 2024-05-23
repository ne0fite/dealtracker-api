import {
  Table,
  Column,
  DataType,
  Model,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
} from 'sequelize-typescript';

import Project from './project';

/**
 * Represents a deal to make a target profit on an asset.
 */
@Table({
  timestamps: true,
  underscored: true,
  tableName: 'deal',
})
export default class Deal extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
  })
  id: string;

  /**
   * Option project for the Deal.
   */
  @ForeignKey(() => Project)
  project: Project;

  /**
   * Deal status.
   */
  @Column(DataType.TEXT)
  status: 'open' | 'closed';

  /**
   * Date position was first opened.
   */
  @Column(DataType.DATE)
  openDate: Date;

  /**
   * Date of last close price.
   */
  @Column(DataType.DATE)
  closeDate: Date;

  /**
   * Exchange where position was opened.
   */
  @Column(DataType.TEXT)
  exchange: string;

  /**
   * Type of fee.
   */
  @Column(DataType.TEXT)
  feeType: 'percent' | 'flat';

  /**
   * Fee charged to open position.
   */
  @Column(DataType.DOUBLE)
  feeOpen: number;

  /**
   * Fee charged to close position.
   */
  @Column(DataType.DOUBLE)
  feeClose: number;

  /**
   * Ticker symbol of position.
   */
  @Column(DataType.TEXT)
  ticker: string;

  /**
   * Type of asset.
   */
  @Column(DataType.TEXT)
  assetType: 'stock' | 'crypto' | 'option' | 'future';

  /**
   * Number of units (shares, tokens, contracts, etc.) in the position.
   */
  @Column(DataType.DOUBLE)
  units: number;

  /**
   * Price of asset when the position was opened.
   */
  @Column(DataType.DOUBLE)
  openPrice: number;

  /**
   * Value of position when opened (units x open price)
   */
  @Column(DataType.DOUBLE)
  invest: number;

  /**
   * Total fee to open position.
   */
  @Column(DataType.DOUBLE)
  openFeeAmount: number;

  /**
   * Goal profit in the deal as a percent of the initial investment.
   */
  @Column(DataType.DOUBLE)
  takeProfit: number;

  /**
   * Total goal profit.
   */
  @Column(DataType.DOUBLE)
  takeProfitAmount: number;

  /**
   * Fees paid to close position at profit.
   */
  @Column(DataType.DOUBLE)
  takeProfitFeeAmount: number;

  /**
   * Cost basis of deal when closed at profit.
   */
  @Column(DataType.DOUBLE)
  takeProfitCostBasis: number;

  /**
   * Gross amount of sale to close deal at profit.
   */
  @Column(DataType.DOUBLE)
  takeProfitGross: number;

  /**
   * Price of asset to close position at profit.
   */
  @Column(DataType.DOUBLE)
  takeProfitPrice: number;

  /**
   * Maximum allowed loss as a percent of initial investment.
   */
  @Column(DataType.DOUBLE)
  stopLoss: number;

  /**
   * Maximum allowed loss.
   */
  @Column(DataType.DOUBLE)
  stopLossAmount: number;

  /**
   * Fees paid to close position at loss.
   */
  @Column(DataType.DOUBLE)
  stopLossFeeAmount: number;

  /**
   * Cost basis when position is closed at loss.
   */
  @Column(DataType.DOUBLE)
  stopLossCostBasis: number;

  /**
   * Gross amount of sale to close position at loss.
   */
  @Column(DataType.DOUBLE)
  stopLossGross: number;

  /**
   * Price of asset to close position at loss.
   */
  @Column(DataType.DOUBLE)
  stopLossPrice: number;

  /**
   * Fee paid at closing price.
   */
  @Column(DataType.DOUBLE)
  closeFeeAmount: number;

  /**
   * Cost basis when closed at closing price.
   */
  @Column(DataType.DOUBLE)
  closeCostBasis: number;

  /**
   * Gross sales when closed at closing price.
   */
  @Column(DataType.DOUBLE)
  closeGross: number;

  /**
   * Last closing price, or the price that was paid to finally close position.
   */
  @Column(DataType.DOUBLE)
  closePrice: number;

  /**
   * Total profit/loss when closed at closing price.
   */
  @Column(DataType.DOUBLE)
  profitLoss: number;

  /**
   * Freeform, random notes about the deal.
   */
  @Column(DataType.TEXT)
  notes: string;

  /**
   * Date deal was created.
   */
  @CreatedAt
  createdAt: Date;

  /**
   * Date deal was last updated.
   */
  @UpdatedAt
  updatedAt: Date;

  profitLossPercent?: number;
  progress?: number;
  progressPercent?: number;
}
