import { Customer, ProductConcrete } from './shared';

export interface ProductRelationsDynamicFixtures {
  customer: Customer;
  productWithRelatedProduct: ProductConcrete;
  relatedProduct: ProductConcrete;
  productWithoutRelatedProduct: ProductConcrete;
}

export interface ProductRelationsStaticFixtures {
  defaultPassword: string;
}
