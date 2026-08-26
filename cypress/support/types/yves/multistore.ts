import { Merchant, ProductConcrete, ProductOffer, User } from './shared';

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
