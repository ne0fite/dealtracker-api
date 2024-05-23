import * as Constants from '../constants';
import User from 'src/models/user';

export const userProviders = [
  {
    provide: Constants.USER_REPOSITORY,
    useValue: User,
  },
];
