import { ProductConcrete, Store, User } from './shared';

export interface DynamicStoreCreationDynamicFixtures {
  rootUser: User;
  product: ProductConcrete;
}

export interface DynamicStoreCreationStaticFixtures {
  defaultPassword: string;
  store: Store;
  productPrice: string;
  cmsPageName: string;
  registrationCmsBlockNames: string[];
}
