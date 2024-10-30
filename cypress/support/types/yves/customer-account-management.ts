import { Customer } from './shared';
import { Store, User } from '../smoke/shared';

export interface CustomerAuthDynamicFixtures {
  customer: Customer;
}

export interface CustomerAuthStaticFixtures {
  defaultPassword: string;
  store: Store;
  rootUser: User;
}
