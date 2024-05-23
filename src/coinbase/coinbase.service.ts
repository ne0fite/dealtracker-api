import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import * as Constants from './constants';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import * as APIKey from './cdp_api_key.json';

import { Ticker } from '../common/coinbase/types';

@Injectable()
export class CoinbaseService {
  constructor(private readonly httpService: HttpService) {}

  generateSignature(method, requestPath, body) {
    // create the json request object
    const accessTimestamp = Date.now() / 1000; // in ms
    const secret = APIKey.privateKey;

    // create the prehash string by concatenating required parts
    const message = accessTimestamp + method + requestPath + body;

    // decode the base64 secret
    const key = Buffer.from(secret, 'base64');

    // create a sha256 hmac with the secret
    const hmac = crypto.createHmac('sha256', key);

    // sign the require message with the hmac and base64 encode the result
    return hmac.update(message).digest('base64');
  }

  async getKnownTradingPairs() {
    const url = `${Constants.API_BASE_URL}/products`;
    const observable = this.httpService.get(url);
    const response = await firstValueFrom(observable);
    return response.data;
  }

  async getTicker(symbol: string): Promise<Ticker> {
    const url = `${Constants.API_BASE_URL}/products/${symbol}/ticker`;
    const observable = this.httpService.get(url);
    const response = await firstValueFrom(observable);

    const ticker: Ticker = {
      ...response.data,
      time: new Date(response.data.time),
    };

    return ticker;
  }
}
