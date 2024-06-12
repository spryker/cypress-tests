import { Customer, ProductConcrete, Quote, Discount } from './shared';

export interface CartItemNoteManagementDynamicFixtures {
  customer: Customer;
  product: ProductConcrete;
}

export interface CartItemNoteManagementStaticFixtures {
  defaultPassword: string;
  cartItemNote: string;
}

export interface ChangeCartItemQuantityDynamicFixtures {
  customer: Customer;
  product: ProductConcrete;
  quote: Quote;
  discount: Discount;
}

export interface ChangeCartItemQuantityStaticFixtures {
  defaultPassword: string;
  total1: string;
  total3: string;
}

export interface RemoveCartItemDynamicFixtures {
  customer: Customer;
  product1: ProductConcrete;
  product2: ProductConcrete;
}

export interface RemoveCartItemStaticFixtures {
  defaultPassword: string;
  total1: string;
}
