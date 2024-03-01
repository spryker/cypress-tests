import { Customer, Product, Quote, User } from './transfer/transfer-types';

export interface ReturnManagementSuite1DynamicFixtures {
  rootUser: User;
  customer: Customer;
  product: Product;
  quoteOne: Quote;
  quoteTwo: Quote;
}

export interface ReturnManagementStaticFixtures {
  defaultPassword: string;
}
