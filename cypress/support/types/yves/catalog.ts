import { Customer, ProductConcrete, Store, User } from './shared';

export interface ProductSearchDmsStaticFixtures {
  defaultPassword: string;
  store: Store;
  productPrice: string;
}

export interface ProductSearchDmsDynamicFixtures {
  rootUser: User;
  customer: Customer;
  product: ProductConcrete;
}
