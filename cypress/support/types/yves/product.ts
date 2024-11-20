import { Customer, Store, User } from './shared';

export interface PublishAndSynchronizeStaticFixtures {
  defaultPassword: string;
}

export interface PublishAndSynchronizeDynamicFixtures {
  customer: Customer;
  rootUser: User;
}

export interface PublishAndSynchronizeDmsStaticFixtures {
  defaultPassword: string;
  store: Store;
}

export interface PublishAndSynchronizeDmsDynamicFixtures {
  rootUser: User;
  customer: Customer;
}
