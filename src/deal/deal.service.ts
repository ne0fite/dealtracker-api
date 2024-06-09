import { Injectable, Inject } from '@nestjs/common';

import { DealDto } from '../common/types/deal.dto';

import * as Constants from '../constants';
import Deal from '../models/deal';
import { calculateDeal } from '../common/calculator';
import { DealStats } from '../common/types/deal-stats';
import {
  QueryInterface,
  SequelizeOptionsBuilder,
} from 'src/sequelize-options-builder';
import { Literal } from 'sequelize/types/utils';

@Injectable()
export class DealService {
  constructor(
    @Inject(Constants.DEAL_REPOSITORY)
    private dealRepository: typeof Deal,
  ) {}

  findAll(query: QueryInterface, accountId: string): Promise<Deal[]> {
    const sequelize = this.dealRepository.sequelize;
    const optionsBuilder = new SequelizeOptionsBuilder<Deal>(
      sequelize,
      accountId,
    );

    const options = optionsBuilder.build(query);

    return this.dealRepository.findAll<Deal>(options);
  }

  getStats(query: QueryInterface, accountId: string): Promise<DealStats> {
    const sequelize = this.dealRepository.sequelize;
    const optionsBuilder = new SequelizeOptionsBuilder<Deal>(
      sequelize,
      accountId,
    );

    const options = optionsBuilder.build(query);

    const aggregateAttributes: [Literal, string][] = [
      [
        sequelize.literal('sum(case when profit_loss > 0 then 1 else 0 end)'),
        'wins',
      ],
      [
        sequelize.literal('sum(case when profit_loss <= 0 then 1 else 0 end)'),
        'losses',
      ],
      [sequelize.literal('sum(profit_loss)'), 'totalProfitLoss'],
      [
        sequelize.literal('sum(profit_loss) / sum(close_cost_basis)'),
        'totalProfitPercent',
      ],
      [
        sequelize.literal('sum(profit_loss) / sum(take_profit_amount) * 100'),
        'totalProgress',
      ],
    ];

    options.attributes = aggregateAttributes;

    return this.dealRepository.findOne<any>(options);
  }

  getById(id: string, accountId: string): Promise<Deal> {
    return this.dealRepository.findOne({
      where: {
        id,
        accountId,
      },
    });
  }

  async create(createDealDto: DealDto, accountId: string): Promise<Deal> {
    const deal = new Deal();

    deal.accountId = accountId;
    deal.set(createDealDto);

    this.calculate(deal);

    return deal.save();
  }

  async update(deal: Deal, updateDealDto: DealDto): Promise<Deal> {
    deal.set(updateDealDto);

    this.calculate(deal);

    return deal.save();
  }

  /**
   * Calculates the deal.
   * @param deal
   */
  calculate(deal: Deal) {
    calculateDeal(deal);
  }
}
