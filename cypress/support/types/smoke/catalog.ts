import { Customer, ProductConcrete, Store, User } from './shared';

export interface ProductSearchStaticFixtures {
  defaultPassword: string;
  productPrice: string;
  customer: Customer;
  concreteProduct: ProductConcrete;
}

export interface ProductSearchDmsStaticFixtures {
  defaultPassword: string;
  store: Store;
  warehouse: string;
  rootUser: User;
  productPrice: string;
  customer: Customer;
  concreteProduct: ProductConcrete;
}
