import { Merchant, ProductConcrete, User } from './shared';

export interface ProductConcreteManagementDynamicFixtures {
  merchant: Merchant;
  merchantUser: User;

  concreteProduct1: ProductConcrete;
  concreteProduct2: ProductConcrete;
}

export interface ProductConcreteManagementStaticFixtures {
  defaultPassword: string;
}
