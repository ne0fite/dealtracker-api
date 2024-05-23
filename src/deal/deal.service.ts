import { Injectable, Inject } from '@nestjs/common';
import { Op } from 'sequelize';

import { DealDto } from '../common/types/deal.dto';

import * as Constants from '../constants';
import Deal from '../models/deal';
import { calculateDeal } from '../common/calculator';
import { DealQuery } from '../common/types';
import { DealStats } from '../common/types/deal-stats';
import { FindOptions } from 'sequelize';

@Injectable()
export class DealService {
  constructor(
    @Inject(Constants.DEAL_REPOSITORY)
    private dealRepository: typeof Deal,
  ) {}

  addFilters(query, where) {
    if (query?.filter?.filters) {
      for (const filter of query.filter.filters) {
        if (filter.status) {
          where['status'] = {
            [Op.eq]: filter.status,
          };
        }
      }
    }
  }

  findAll(query: DealQuery): Promise<Deal[]> {
    const options: FindOptions = {
      where: {},
      order: [
        ['openDate', 'desc'],
        ['createdAt', 'desc'],
      ],
    };

    this.addFilters(query, options.where);

    return this.dealRepository.findAll<Deal>(options);
  }

  getStats(query: DealQuery): Promise<DealStats> {
    const sequelize = this.dealRepository.sequelize;

    const options: FindOptions = {
      attributes: [
        [
          sequelize.literal('sum(case when profit_loss > 0 then 1 else 0 end)'),
          'wins',
        ],
        [
          sequelize.literal(
            'sum(case when profit_loss <= 0 then 1 else 0 end)',
          ),
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
      ],
      where: {},
    };

    this.addFilters(query, options.where);

    return this.dealRepository.findOne<any>(options);
  }

  getById(id: string): Promise<Deal> {
    return this.dealRepository.findByPk(id);
  }

  async create(createDealDto: DealDto): Promise<Deal> {
    const deal = new Deal();

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
