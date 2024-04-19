import { Customer, User } from './shared';

export interface PublishAndSynchronizeDynamicFixtures {
  customer: Customer;
  rootUser: User;
}

export interface ProductStaticFixtures {
  defaultPassword: string;
}
