import { Merchant, ProductConcrete, User } from './shared';

export interface ProductManagementDynamicFixtures {
  merchant: Merchant;
  merchantUser: User;

  concreteProduct1: ProductConcrete;
  concreteProduct2: ProductConcrete;
}

export interface ProductManagementStaticFixtures {
  defaultPassword: string;
}
