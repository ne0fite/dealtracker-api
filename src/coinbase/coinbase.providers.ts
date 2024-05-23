import * as Constants from '../constants';
import CoinbaseProduct from 'src/models/coinbase_product';

export const coinbaseProviders = [
  {
    provide: Constants.COINBASE_PRODUCT_REPOSITORY,
    useValue: CoinbaseProduct,
  },
];
