import { Customer, ProductConcrete, Store, User } from './shared';

export interface ProductSearchDmsStaticFixtures {
  defaultPassword: string;
  store: Store;
}

export interface ProductSearchDmsDynamicFixtures {
  rootUser: User;
  customer: Customer;
  product: ProductConcrete;
}
