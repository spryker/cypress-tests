import { Customer, User } from './shared';

export interface CustomerImpersonationStaticFixtures {
  defaultPassword: string;
}

export interface CustomerImpersonationDynamicFixtures {
  customer: Customer;
  agentUser: User;
}
