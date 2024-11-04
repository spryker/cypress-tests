import { Address, Customer, Product, User } from './shared';

export interface OrderCreationDynamicFixtures {
  customer: Customer;
  address: Address;
  product: Product;
  rootUser: User;
}

export interface OrderManagementStaticFixtures {
  defaultPassword: string;
}

export interface CustomOrderReferenceManagementDynamicFixtures {
  customer: Customer;
  rootUser: User;
}

export interface CustomOrderReferenceManagementStaticFixtures {
  defaultPassword: string;
  orderReference: string;
}
