import { Customer, ProductConcrete } from './shared';

export interface CartUpSellingProductsDynamicFixtures {
  customer: Customer;
  product: ProductConcrete;
  upSellingProduct: ProductConcrete;
}

export interface CartUpSellingProductsStaticFixtures {
  defaultPassword: string;
}
