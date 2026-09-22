import { Address, Customer, ProductConcrete, User } from './shared';

export interface OrderCancellationDynamicFixtures {
  rootUser: User;

  wholeOrderCustomer: Customer;
  wholeOrderAddress: Address;
  wholeOrderProduct: ProductConcrete;

  mixedStateCustomer: Customer;
  mixedStateAddress: Address;
  advancedItemProduct: ProductConcrete;
  cancellableItemProduct: ProductConcrete;
}

export interface OrderCancellationStaticFixtures {
  defaultPassword: string;
}
