import { Customer, Product, User } from './transfer/transfer-types';

export interface OrderManagementSuite1DynamicFixtures {
  customer: Customer;
  product: Product;
  rootUser: User;
}

export interface OrderManagementStaticFixtures {
  defaultPassword: string;
}
