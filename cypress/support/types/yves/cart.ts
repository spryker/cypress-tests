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

export interface SharedCartExternalLinkStaticFixtures {
  defaultPassword: string;
  cartPreviewTitlePrefix: string;
}

export interface SharedCartExternalLinkDynamicFixtures {
  customer: Customer;
  product1: ProductConcrete;
  quote: Quote;
}

export interface SharedCartCheckoutDynamicFixtures {
  ownerCustomer: Customer;
  receiverCustomer: Customer;
  receiverAddress: Address;
  product: ProductConcrete;
  merchant: Merchant;
  productOffer: ProductOffer;
}

export interface SharedCartCheckoutStaticFixtures {
  defaultPassword: string;
  soldByText: string;
  cartName: string;
  ownerAccessText: string;
  fullAccessText: string;
}
