import { Customer, Merchant, ProductConcrete, ProductOffer } from './shared';

export interface WishlistManagementDynamicFixtures {
  customer: Customer;
  product1: ProductConcrete;
  product2: ProductConcrete;
}

export interface WishlistManagementStaticFixtures {
  defaultPassword: string;
  defaultWishlistName: string;
  secondWishlistName: string;
}

export interface WishlistProductOffersDynamicFixtures {
  customer: Customer;
  product: ProductConcrete;
  merchant1: Merchant;
  merchant2: Merchant;
  productOffer1: ProductOffer;
  productOffer2: ProductOffer;
}

export interface WishlistProductOffersStaticFixtures {
  defaultPassword: string;
  soldByText: string;
  wishlistName: string;
}
