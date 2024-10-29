import { Customer, User } from './shared';

export interface PublishAndSynchronizeStaticFixtures {
  defaultPassword: string;
}

export interface PublishAndSynchronizeDynamicFixtures {
  customer: Customer;
  rootUser: User;
}
