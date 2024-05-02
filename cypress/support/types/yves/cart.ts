import { Customer, ProductConcrete, Quote } from './shared';

export interface CartItemDynamicFixtures {
  customer: Customer;
  product1: ProductConcrete;
  product2: ProductConcrete;
  quote: Quote;
}

export interface CartItemStaticFixtures {
  defaultPassword: string;
  cartItemNote: string;
}
