import { Customer, Product, Quote } from './transfer/transfer-types';

export interface CheckoutSuite1DynamicFixtures {
  customer: Customer;
  productOne: Product;
  productTwo: Product;
  quoteOne: Quote;
  quoteTwo: Quote;
}

export interface CheckoutStaticFixtures {
  defaultPassword: string;
}
