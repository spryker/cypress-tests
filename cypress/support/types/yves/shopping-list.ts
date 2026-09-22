import { Customer, Merchant, ProductConcrete, ProductOffer } from './shared';

export interface ShoppingListProductOffersDynamicFixtures {
  customer: Customer;
  product: ProductConcrete;
  merchant1: Merchant;
  merchant2: Merchant;
  productOffer1: ProductOffer;
  productOffer2: ProductOffer;
}

export interface ShoppingListProductOffersStaticFixtures {
  defaultPassword: string;
  soldByText: string;
}

export interface ShoppingListSharingDynamicFixtures {
  ownerCustomer: Customer;
  receiverCustomer: Customer;
  product: ProductConcrete;
  merchant: Merchant;
  productOffer: ProductOffer;
}

export interface ShoppingListSharingStaticFixtures {
  defaultPassword: string;
  soldByText: string;
  fullAccessText: string;
}
