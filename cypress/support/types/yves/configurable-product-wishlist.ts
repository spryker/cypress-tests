import { Customer, ProductConcrete } from './shared';

export interface ConfigurableProductWishlistStaticFixtures {
  defaultPassword: string;
  configurationCompleteStatus: string;
}

export interface ConfigurableProductWishlistDynamicFixtures {
  customer: Customer;
  product: ProductConcrete;
}
