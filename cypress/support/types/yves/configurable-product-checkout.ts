import { Address, Customer, ProductConcrete } from './shared';

export interface ConfigurableProductCheckoutStaticFixtures {
  defaultPassword: string;
  configurationNotCompleteStatus: string;
  configurationCompleteStatus: string;
}

export interface ConfigurableProductCheckoutDynamicFixtures {
  customer: Customer;
  address: Address;
  product: ProductConcrete;
}
