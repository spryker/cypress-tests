import { Address, Customer, PaymentMethod, ProductConcrete, Quote, ShipmentMethod, Store, User } from './shared';

export interface BasicCheckoutDynamicFixtures {
  customer: Customer;
  address: Address;
  product1: ProductConcrete;
  product2: ProductConcrete;
  quote1: Quote;
  quote2: Quote;
  quote3: Quote;
  quote4: Quote;
  rootUser: User;
}

export interface BasicCheckoutDmsDynamicFixtures {
  customer: Customer;
  address: Address;
  product1: ProductConcrete;
  product2: ProductConcrete;
  quote1: Quote;
  quote2: Quote;
  quote3: Quote;
  quote4: Quote;
  rootUser: User;
}

export interface BasicCheckoutDmsStaticFixtures {
  defaultPassword: string;
  store: Store;
}

export interface CheckoutStaticFixtures {
  defaultPassword: string;
}
