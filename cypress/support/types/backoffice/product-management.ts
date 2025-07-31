import { User, ProductClass, Store } from './shared';

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

export interface Product {
  sku: string;
  name: string;
  abstract_sku: string;
  localized_attributes: [
    {
      name: string;
    },
  ];
}
