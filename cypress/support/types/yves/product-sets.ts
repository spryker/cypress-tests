import { Customer, ProductConcrete, User } from './shared';

export interface ProductSetsDynamicFixtures {
  rootUser: User;
  customer: Customer;
  variantProduct: ProductConcrete;
  secondVariantProduct: ProductConcrete;
  simpleProduct: ProductConcrete;
}

export interface ProductSetsStaticFixtures {
  defaultPassword: string;
  variantAttributeKey: string;
  variantAttributeValue: string;
}
