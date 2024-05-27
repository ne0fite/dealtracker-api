import * as crypto from 'crypto';
import { sign } from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import * as Constants from './constants';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { Ticker } from '../common/coinbase/types';

@Injectable()
export class CoinbaseService {
  static CB_KEY_NAME = process.env.CB_KEY_NAME;
  static CB_PRIVATE_KEY = `${process.env.CB_PRIVATE_KEY}`;

  constructor(private readonly httpService: HttpService) {}

  createAuthToken(): string {
    const algorithm = 'ES256';
    const token = sign(
      {
        iss: 'cdp',
        nbf: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 120,
        sub: CoinbaseService.CB_KEY_NAME,
      },
      CoinbaseService.CB_PRIVATE_KEY,
      {
        algorithm,
        header: {
          kid: CoinbaseService.CB_KEY_NAME,
          nonce: crypto.randomBytes(16).toString('hex'),
        } as any,
      },
    );

    return token;
  }

  generateSignature(method, requestPath, body) {
    // create the json request object
    const accessTimestamp = Date.now() / 1000; // in ms
    const secret = CoinbaseService.CB_PRIVATE_KEY;

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
