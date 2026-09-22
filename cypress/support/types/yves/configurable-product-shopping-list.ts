import { Customer, ProductConcrete } from './shared';

export interface ConfigurableProductShoppingListStaticFixtures {
  defaultPassword: string;
  configurationNotCompleteStatus: string;
  configurationCompleteStatus: string;
  unconfiguredCheckoutBlockedMessage: string;
  availableStock: number;
}

export interface ConfigurableProductShoppingListDynamicFixtures {
  customer: Customer;
  product: ProductConcrete;
}
