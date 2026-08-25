import { Address, Customer, Merchant, ProductConcrete } from './shared';

export interface QuickOrderToCheckoutDynamicFixtures {
  customer: Customer;
  address: Address;
  product1: ProductConcrete;
  product2: ProductConcrete;
  merchant1: Merchant;
  merchant2: Merchant;
}

export interface QuickOrderToCheckoutStaticFixtures {
  defaultPassword: string;
  soldByText: string;
  firstProductQuantity: number;
  secondProductQuantity: number;
}
