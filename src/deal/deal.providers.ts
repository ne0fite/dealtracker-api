import * as Constants from '../constants';
import Deal from '../models/deal';

export const dealProviders = [
  {
    provide: Constants.DEAL_REPOSITORY,
    useValue: Deal,
  },
];
