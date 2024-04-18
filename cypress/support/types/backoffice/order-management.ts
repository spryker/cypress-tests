import { Address, Customer, Product, User } from './shared';

export interface OrderCreationDynamicFixtures {
  customer: Customer;
  address: Address;
  product: Product;
  rootUser: User;
}

export interface DummyPaymentOmsFlowDynamicFixtures {
  customer: Customer;
  address: Address;
  product: Product;
  rootUser: User;
}

export interface OrderManagementStaticFixtures {
  defaultPassword: string;
}

export interface DummyPaymentOmsFlowStaticFixtures {
  defaultPassword: string;
}
