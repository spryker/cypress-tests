import { Address, Customer, Product, User } from './shared';

export interface RefundManagementDynamicFixtures {
  rootUser: User;
  customer: Customer;
  address: Address;
  product: Product;
}

export interface RefundManagementStaticFixtures {
  defaultPassword: string;
  returnCreatedMessage: string;
}
