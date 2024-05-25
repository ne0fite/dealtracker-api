import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Op } from 'sequelize';

import * as Constants from '../constants';
import * as CryptoSymbols from '../common/config/crypto-symbols.json';
import { ApiService } from '../alphavantage/api.service';
import Deal from 'src/models/deal';
import { CoinbaseService } from 'src/coinbase/coinbase.service';

const ENABLE_UPDATER = process.env.ENABLE_UPDATER === 'true';

@Injectable()
export class UpdaterService {
  static SupportedCryptoSymbols = new Map(Object.entries(CryptoSymbols));

  static schedule = '*/5 * * * * *';

  private readonly logger = new Logger(UpdaterService.name);

  constructor(
    @Inject(Constants.DEAL_REPOSITORY)
    private dealRepository: typeof Deal,
    private api: ApiService,
    private coinbaseService: CoinbaseService,
  ) {}

  @Cron(UpdaterService.schedule, {
    name: 'deal updater',
    disabled: !ENABLE_UPDATER,
  })
  async updateDeals() {
    const openDeals = await this.dealRepository.findAll({
      where: {
        status: 'open',
        assetType: {
          [Op.in]: ['crypto', 'stock'],
        },
        ticker: {
          [Op.ne]: null,
        },
      },
    });

    this.logger.debug(`Found ${openDeals.length} open deals to update`);

    const stockDealMap = {};
    const cryptoDealMap = {};

    for (const deal of openDeals) {
      if (deal.assetType === 'crypto') {
        // if (!UpdaterService.SupportedCryptoSymbols.has(deal.ticker)) {
        //   this.logger.debug(
        //     `Skipping unsupported crypto symbol ${deal.ticker}`,
        //   );
        //   continue;
        // }

        if (cryptoDealMap[deal.ticker] == null) {
          cryptoDealMap[deal.ticker] = [];
        }
        cryptoDealMap[deal.ticker].push(deal);
      } else if (deal.assetType === 'stock') {
        if (stockDealMap[deal.ticker] == null) {
          stockDealMap[deal.ticker] = [];
        }
        stockDealMap[deal.ticker].push(deal);
      }
    }

    for (const symbol in cryptoDealMap) {
      const cryptoDeals = cryptoDealMap[symbol];

      this.logger.debug(
        `Getting ${symbol} crypto price quote for ${cryptoDeals.length} deals`,
      );

      const ticker = await this.coinbaseService.getTicker(`${symbol}-USD`);
      if (ticker) {
        for (const deal of cryptoDeals) {
          deal.closePrice = ticker.price;
          deal.closeDate = ticker.time;
          await deal.save();
        }
      }
    }

    for (const symbol in stockDealMap) {
      const stockDeals = stockDealMap[symbol];

      this.logger.debug(
        `Getting ${symbol} stock price quote for ${stockDeals.length} deals`,
      );

      const quotes = await this.api.getStockIntraday(symbol, '1min');
      if (quotes.length > 0) {
        const quote = quotes[0];
        for (const deal of stockDeals) {
          deal.closePrice = quote.close;
          deal.closeDate = quote.timestamp;
          await deal.save();
        }
      }
    }
  }
}
