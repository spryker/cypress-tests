import { Address, Customer, ProductConcrete, Quote } from './shared';

export interface BasicCheckoutDynamicFixtures {
  customer: Customer;
  address: Address;
  product1: ProductConcrete;
  product2: ProductConcrete;
  quote1: Quote;
  quote2: Quote;
  quote3: Quote;
  quote4: Quote;
}

export interface CheckoutStaticFixtures {
  defaultPassword: string;
}
