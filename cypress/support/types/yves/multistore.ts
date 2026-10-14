import { Customer, Merchant, ProductConcrete, ProductOffer, User } from './shared';

export interface MultistoreCmsPageDynamicFixtures {
  rootUser: User;
}

export interface MultistoreCmsPageStaticFixtures {
  defaultPassword: string;
  cmsPageName: string;
  storeName: string;
}

export interface MultistoreProductDynamicFixtures {
  rootUser: User;
  product: ProductConcrete;
  productToUnassign: ProductConcrete;
  customer: Customer;
}

export interface MultistoreProductStaticFixtures {
  defaultPassword: string;
  primaryStoreName: string;
  secondaryStoreName: string;
  primaryStorePrice: string;
  secondaryStorePrice: string;
  unassignedStoreProductPrice: string;
  currencySymbol: string;
}

export interface MultistoreProductOfferDynamicFixtures {
  rootUser: User;
  product: ProductConcrete;
  merchant: Merchant;
  merchantToUnassign: Merchant;
  merchantToUnassignUser?: User;
  productOffer: ProductOffer;
  productOfferToUnassign: ProductOffer;
}

export interface MultistoreProductOfferStaticFixtures {
  defaultPassword: string;
  primaryStoreName: string;
  secondaryStoreName: string;
  primaryStorePrice: string;
  secondaryStorePrice: string;
}
