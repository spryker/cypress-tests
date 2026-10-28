import { Address, Customer, ProductConcrete } from './shared';

export interface ConfigurableProductCheckoutStaticFixtures {
  defaultPassword: string;
  configurationNotCompleteStatus: string;
  configurationCompleteStatus: string;
  // Marketplace invoice is offered only for a cart of merchant items, which the B2C marketplace does not make of
  // a product without a merchant.
  paymentMethod: string;
}

export interface ConfigurableProductCheckoutDynamicFixtures {
  customer: Customer;
  address: Address;
  product: ProductConcrete;
}
