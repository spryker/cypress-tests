import { Address, Customer, ProductConcrete } from './shared';

export interface ProductBundleCheckoutStaticFixtures {
  defaultPassword: string;
  // The items a bundle expands into carry no merchant, so the B2C marketplace does not offer its marketplace
  // invoice for them.
  paymentMethod: string;
}

export interface ProductBundleCheckoutDynamicFixtures {
  customer: Customer;
  address: Address;
  bundleProduct: ProductConcrete;
  bundledProductOne: ProductConcrete;
  bundledProductTwo: ProductConcrete;
}
