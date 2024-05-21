import { Customer, ProductConcrete, User } from './shared';

export interface ProductSearchStaticFixtures {
  defaultPassword: string;
  productPrice: string;
  customer: Customer;
  concreteProduct: ProductConcrete;
}

export interface ProductSearchDmsStaticFixtures {
  defaultPassword: string;
  defaultStore: string;
  defaultWarehouse: string;
  rootUser: User;
  productPrice: string;
  customer: Customer;
  concreteProduct: ProductConcrete;
}
