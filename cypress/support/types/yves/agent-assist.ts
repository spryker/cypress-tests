import { Address, Customer, ProductConcrete, User } from './shared';

export interface CustomerImpersonationStaticFixtures {
  defaultPassword: string;
}

export interface CustomerImpersonationDynamicFixtures {
  customer: Customer;
  address: Address;
  agentUser: User;
  product: ProductConcrete;
}
