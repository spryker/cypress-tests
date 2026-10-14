import type { ActionEnum } from '@pages/mp';
import { Address, Customer, ProductConcrete, User } from './shared';

export interface ReturnCreationStorefrontDynamicFixtures {
  rootUser: User;
  customer: Customer;
  address: Address;
  firstReturnedProduct: ProductConcrete;
  secondReturnedProduct: ProductConcrete;
  keptProduct: ProductConcrete;
  merchantUser?: User;
}

export interface ReturnCreationStorefrontStaticFixtures {
  defaultPassword: string;
  returnDetailsTitle: string;
  waitingForReturnState: string;
  shippedState: string;
  orderShippingEvents: Array<{ state: string; shouldTriggerOmsInCli?: boolean }>;
  merchantOrderShippingActions?: Array<keyof typeof ActionEnum>;
}
