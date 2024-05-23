import { Controller, Get, Param } from '@nestjs/common';
import { CoinbaseService } from './coinbase.service';
import { Ticker } from 'src/common/coinbase/types';

@Controller('/api/v1/coinbase')
export class CoinbaseController {
  constructor(private coinbaseService: CoinbaseService) {}

  @Get('product/trading-pairs')
  async getKnownTradingPairs() {
    return this.coinbaseService.getKnownTradingPairs();
  }

  @Get('product/:symbol/ticker')
  async getTicker(@Param() params: any): Promise<Ticker> {
    return this.coinbaseService.getTicker(params.symbol);
  }
}
