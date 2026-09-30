import { Address, Customer, Product, User } from './shared';

export interface OrderCreationDynamicFixtures {
  customer: Customer;
  address: Address;
  product: Product;
  rootUser: User;
}

export interface OrderCreationDmsDynamicFixtures {
  customer: Customer;
  address: Address;
  product: Product;
  rootUser: User;
}
