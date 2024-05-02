import { Customer, ProductConcrete, Quote, Discount } from './shared';

export interface CartItemDynamicFixtures {
  customer: Customer;
  product1: ProductConcrete;
  product2: ProductConcrete;
  quote: Quote;
  discount: Discount;
}

export interface CartItemStaticFixtures {
  defaultPassword: string;
  cartItemNote: string;
}
