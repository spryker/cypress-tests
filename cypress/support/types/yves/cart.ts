import { Address, Customer, ProductConcrete, Quote } from './shared';

export interface CartItemNoteDynamicFixtures {
  customer: Customer;
  address: Address;
  product1: ProductConcrete;
  product2: ProductConcrete;
}

export interface CartItemNoteStaticFixtures {
  defaultPassword: string;
  cartItemNote: string;
}

export interface CartItemQuantityDynamicFixtures {
  customer: Customer;
  product: ProductConcrete;
  quote1: Quote;
  quote2: Quote;
}

export interface CartItemQuantityStaticFixtures {
  defaultPassword: string;
}
