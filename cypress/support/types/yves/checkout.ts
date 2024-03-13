import { Address, Customer, Product, Quote } from './shared';

export interface BasicCheckoutDynamicFixtures {
  customer: Customer;
  address: Address;
  product1: Product;
  product2: Product;
  quote1: Quote;
  quote2: Quote;
  quote3: Quote;
  quote4: Quote;
}

export interface CheckoutStaticFixtures {
  defaultPassword: string;
}
