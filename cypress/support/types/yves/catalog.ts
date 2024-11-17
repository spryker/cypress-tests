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
  productPrice: string;
  concreteProduct: ProductConcrete;
}

export interface ProductSearchDmsDynamicFixtures {
  rootUser: User;
    customer: Customer;
}
