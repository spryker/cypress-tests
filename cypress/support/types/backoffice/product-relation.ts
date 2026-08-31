import { User, ProductConcrete } from './shared';

export interface ProductRelationCreateDynamicFixtures {
  rootUser: User;
  baseProduct: ProductConcrete;
  relatedProduct: ProductConcrete;
}

export interface ProductRelationCreateStaticFixtures {
  defaultPassword: string;
}
