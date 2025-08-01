import { User, Product, Store } from './shared';

export interface ProductManagementStaticFixtures {
  defaultPassword: string;
}

export interface ProductManagementDynamicFixtures {
  storeAT: Store;
  storeDE: Store;
  rootUser: User;
  product: Product;
}
