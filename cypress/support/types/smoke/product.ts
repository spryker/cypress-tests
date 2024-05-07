import { Customer, User } from './shared';

export interface PublishAndSynchronizeStaticFixtures {
  defaultPassword: string;
  customer: Customer;
  rootUser: User;
}
