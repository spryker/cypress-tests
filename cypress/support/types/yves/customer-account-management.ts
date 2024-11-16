import { Customer } from './shared';
import { Store, User } from '../smoke/shared';

export interface CustomerAuthDynamicFixtures {
  customer: Customer;
    rootUser: User;
}

export interface CustomerAuthStaticFixtures {
  defaultPassword: string;
  store: Store;
}
