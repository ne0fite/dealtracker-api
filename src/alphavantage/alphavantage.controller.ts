import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiService } from './api.service';
import { Interval } from '../common/types';

type QuoteParams = {
  symbol: string;
  interval: Interval;
};

@Controller('/api/v1/alphavantage')
export class AlphavantageController {
  constructor(private api: ApiService) {}

  @Get('crypto/:symbol/:interval')
  async getCryptoIntraday(@Param() params: QuoteParams) {
    return this.api.getCryptoIntraday(params.symbol, params.interval);
  }

  @Get('stock/:symbol/:interval')
  async getStockIntraday(@Param() params: QuoteParams) {
    return this.api.getStockIntraday(params.symbol, params.interval);
  }

  @Get('stock/search')
  async searchSymbol(@Query() query) {
    return this.api.searchSymbol(query.q);
  }
}
