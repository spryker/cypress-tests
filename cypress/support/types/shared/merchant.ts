import { User } from './user';

export interface Merchant {
  name: string;
}

export interface MerchantUser extends User {
  first_name: string;
}
