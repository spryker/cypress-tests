import { Customer, ProductConcrete, User } from './shared';

export interface ProductSetManagementDynamicFixtures {
  rootUser: User;
  customer: Customer;
  firstProduct: ProductConcrete;
  secondProduct: ProductConcrete;
  thirdProduct: ProductConcrete;
}

export interface ProductSetManagementStaticFixtures {
  defaultPassword: string;
}
