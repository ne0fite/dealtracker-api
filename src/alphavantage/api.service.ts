import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DateTime } from 'luxon';

import { Interval, OutputSize, Quote, Ticker } from '../common/types';

@Injectable()
export class ApiService {
  /**
   * @TODO extract to config/env
   */
  static API_KEY = 'MLU0C8WGUOPJ3BON';

  static API_BASE_URL = 'https://www.alphavantage.co/query';

  static DEFAULT_MARKET = 'USD';

  static readonly DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';

  static readonly DEFAULT_TIME_ZONE = 'UTC';

  constructor(private readonly httpService: HttpService) {}

  /**
   * Get the crytocurrency intraday quote for the crypto symbol.
   * @param symbol crypto symbol to quote (i.e., BTC, SOL, ETH, etc.)
   * @param interval time interval to quote
   * @param outputsize full or compact data
   * @returns JSON response from AlphaVantage
   */
  getCryptoIntraday(
    symbol: string,
    interval: Interval,
    outputsize: OutputSize = 'compact',
  ): Promise<Quote[]> {
    const params = {
      function: 'CRYPTO_INTRADAY',
      symbol,
      market: ApiService.DEFAULT_MARKET,
      interval,
      outputsize,
      apikey: ApiService.API_KEY,
      entitlement: 'delayed',
    };

    return new Promise<Quote[]>((resolve, reject) => {
      this.httpService
        .get(ApiService.API_BASE_URL, {
          params,
        })
        .subscribe((response) => {
          const key = `Time Series Crypto (${interval})`;

          if (response.data[key] == null) {
            reject(
              new InternalServerErrorException(
                `Malformed response from AlphaAdvantage: ${symbol} ${interval}`,
              ),
            );
          }

          const quotes = this.transformQuoteData(response.data[key], 'UTC');

          resolve(quotes);
        });
    });
  }

  /**
   * Get the crytocurrency intraday quote for the crypto symbol.
   * @param symbol crypto symbol to quote (i.e., BTC, SOL, ETH, etc.)
   * @param interval time interval to quote
   * @param outputsize full or compact data
   * @returns JSON response from AlphaVantage
   */
  getStockIntraday(
    symbol: string,
    interval: Interval,
    outputsize: OutputSize = 'compact',
  ): Promise<Quote[]> {
    const params = {
      function: 'TIME_SERIES_INTRADAY',
      symbol,
      interval,
      outputsize,
      apikey: ApiService.API_KEY,
      entitlement: 'delayed', // <- enables realtime 15-min delayed quotes
    };

    return new Promise<Quote[]>((resolve, reject) => {
      this.httpService
        .get(ApiService.API_BASE_URL, {
          params,
        })
        .subscribe((response) => {
          const key = `Time Series (${interval})`;

          if (response.data[key] == null) {
            reject(
              new InternalServerErrorException(
                `Malformed response from AlphaAdvantage: ${symbol} ${interval}`,
              ),
            );
          }

          const quotes = this.transformQuoteData(
            response.data[key],
            'US/Eastern',
          );

          resolve(quotes);
        });
    });
  }

  searchSymbol(keywords: string): Promise<Ticker[]> {
    const params = {
      function: 'SYMBOL_SEARCH',
      keywords,
      apikey: ApiService.API_KEY,
    };

    return new Promise<Ticker[]>((resolve, reject) => {
      this.httpService
        .get(ApiService.API_BASE_URL, {
          params,
        })
        .subscribe((response) => {
          if (response.data.bestMatches == null) {
            reject(
              new InternalServerErrorException(
                'Malformed response from AlphaAdvantage',
              ),
            );
            return;
          }

          const results = response.data.bestMatches.map((match) => ({
            symbol: match['1. symbol'],
            name: match['2. name'],
            type: match['3. type'],
            region: match['4. region'],
            marketOpen: match['5. marketOpen'],
            marketClose: match['6. marketClose'],
            timzezone: match['7. timezone'],
            currency: match['8. currency'],
            matchScore: match['9. matchScore'],
          }));

          resolve(results);
        });
    });
  }

  /**
   * Transform the quote JSON received from AV into array of Quotes.
   * @param quoteData quote JSON
   * @returns quotes
   */
  private transformQuoteData(quoteData: [], timezone: string): Quote[] {
    const quotes = [];

    for (const timestamp in quoteData) {
      const quoteJson = quoteData[timestamp];
      quotes.push({
        timestamp: DateTime.fromFormat(timestamp, ApiService.DATE_FORMAT, {
          zone: timezone,
        }).setZone('local'),
        open: quoteJson['1. open'],
        high: quoteJson['2. high'],
        low: quoteJson['3. low'],
        close: quoteJson['4. close'],
        volume: quoteJson['5. volume'],
      });
    }

    return quotes;
  }
}
