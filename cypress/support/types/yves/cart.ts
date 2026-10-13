import { Address, Customer, Discount, Merchant, ProductConcrete, ProductOffer, Quote } from './shared';

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

export interface SharedCartDynamicFixtures {
  ownerCustomer: Customer;
  receiverCustomer: Customer;
  receiverAddress: Address;
  product: ProductConcrete;
  merchant: Merchant;
  productOffer: ProductOffer;
  colleagueSharedQuote: Quote;
  linkSharedQuote: Quote;
}

export interface SharedCartStaticFixtures {
  defaultPassword: string;
  soldByText: string;
  fullAccessText: string;
  cartPreviewTitlePrefix: string;
}
