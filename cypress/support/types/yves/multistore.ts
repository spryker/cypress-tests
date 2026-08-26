import { ProductConcrete, User } from './shared';

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
