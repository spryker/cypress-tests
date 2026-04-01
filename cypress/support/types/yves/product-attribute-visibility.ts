import { Customer, ProductConcrete, User } from './shared';

export interface ProductAttributeVisibilityStaticFixtures {
  defaultPassword: string;
  attributeKey: string;
  attributeValue: string;
}

export interface ProductAttributeVisibilityDynamicFixtures {
  rootUser: User;
  customer: Customer;
  product: ProductConcrete;
}
