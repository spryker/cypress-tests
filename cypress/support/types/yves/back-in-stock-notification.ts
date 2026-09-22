import { Customer, ProductConcrete } from './shared';

export interface BackInStockNotificationStaticFixtures {
  defaultPassword: string;

  // Storefront wording, so a repository translating it differently overrides it here.
  outOfStockLabel: string;
  subscribedMessage: string;
  unsubscribedMessage: string;
}

export interface BackInStockNotificationDynamicFixtures {
  customer: Customer;
  outOfStockProduct: ProductConcrete;
  inStockProduct: ProductConcrete;
}
