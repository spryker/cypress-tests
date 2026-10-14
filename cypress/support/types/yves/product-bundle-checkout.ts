import { Address, Customer, ProductConcrete } from './shared';

export interface ProductBundleCheckoutStaticFixtures {
  defaultPassword: string;
}

export interface ProductBundleCheckoutDynamicFixtures {
  customer: Customer;
  address: Address;
  bundleProduct: ProductConcrete;
  bundledProductOne: ProductConcrete;
  bundledProductTwo: ProductConcrete;
}
