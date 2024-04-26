import { Customer, User } from './shared';

export interface PublishAndSynchronizeSmokeStaticFixtures {
  defaultPassword: string;
  customer: Customer;
  rootUser: User;
}
