import { Address, Customer, Product, User } from './shared';

export interface OrderManagementSuite1DynamicFixtures {
  customer: Customer;
  address: Address;
  product: Product;
  rootUser: User;
}

export interface OrderManagementStaticFixtures {
  defaultPassword: string;
}
