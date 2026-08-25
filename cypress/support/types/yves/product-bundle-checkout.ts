import { Customer, ProductConcrete } from './shared';

export interface ProductBundleCheckoutStaticFixtures {
  defaultPassword: string;
}

export interface ProductBundleCheckoutDynamicFixtures {
  customer: Customer;
  bundleProduct: ProductConcrete;
  bundledProductOne: ProductConcrete;
  bundledProductTwo: ProductConcrete;
}
