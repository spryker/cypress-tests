import { Address, Customer, Product, User } from './shared';

export interface ReturnCreationDynamicFixtures {
  rootUser: User;
  customer: Customer;
  address: Address;
  product: Product;
}

export interface ReturnManagementStaticFixtures {
  defaultPassword: string;
}
