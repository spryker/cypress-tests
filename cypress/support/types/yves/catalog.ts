import { Customer, ProductConcrete } from './shared';

export interface ProductSearchDynamicFixtures {
  customer: Customer;
  concreteProduct: ProductConcrete;
}

export interface ProductSearchStaticFixtures {
  defaultPassword: string;
  productPrice: string;
}
