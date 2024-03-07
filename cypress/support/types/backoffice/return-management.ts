import { Address, Customer, Product, Quote, User } from './shared';

export interface ReturnManagementSuite1DynamicFixtures {
  rootUser: User;
  customer: Customer;
  address: Address;
  product: Product;
  quote1: Quote;
  quote2: Quote;
}

export interface ReturnManagementStaticFixtures {
  defaultPassword: string;
}
