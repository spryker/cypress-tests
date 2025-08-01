import { User, ProductClass, Product, Store } from './shared';

export interface ProductManagementStaticFixtures {
  defaultPassword: string;
}

export interface ProductManagementDynamicFixtures {
  rootUser: User;
  productClass: ProductClass;
  product: Product;
  storeAT: Store;
  storeDE: Store;
}
