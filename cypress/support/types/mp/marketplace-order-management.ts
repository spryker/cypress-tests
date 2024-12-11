import { Address, Customer, Merchant, PaymentMethod, ProductConcrete, Store, User } from './shared';

export interface OrderCreationDynamicFixtures {
  rootUser: User;
  merchant: Merchant;
  merchantUser: User;
  customer: Customer;
  address: Address;
  merchantProduct: ProductConcrete;
}

export interface OrderCreationDmsDynamicFixtures {
  rootUser: User;
  merchant: Merchant;
  merchantUser: User;
  customer: Customer;
  address: Address;
  merchantProduct: ProductConcrete;
}

export interface OrderCreationStaticFixtures {
  defaultPassword: string;
}

export interface OrderCreationDmsStaticFixtures {
  defaultPassword: string;
  store: Store;
  paymentMethods: PaymentMethod[];
}
