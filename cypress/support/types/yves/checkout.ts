import { Address, Customer, ProductConcrete, Store, User } from './shared';

export interface BasicCheckoutDynamicFixtures {
  customer: Customer;
  address: Address;
  product1: ProductConcrete;
  product2: ProductConcrete;
}

export interface BasicCheckoutDmsDynamicFixtures {
  customer: Customer;
  address: Address;
  product1: ProductConcrete;
  product2: ProductConcrete;
  rootUser: User;
}

export interface BasicCheckoutDmsStaticFixtures {
  defaultPassword: string;
  store: Store;
  paymentMethods: PaymentMethod[];
}

interface PaymentMethod {
  key: string;
  name: string;
}

export interface CheckoutStaticFixtures {
  defaultPassword: string;
}
