import { Customer, ProductConcrete, User } from './shared';

export interface CustomerImpersonationStaticFixtures {
  defaultPassword: string;
}

export interface CustomerImpersonationDynamicFixtures {
  customer: Customer;
  agentUser: User;
  product: ProductConcrete;
}
