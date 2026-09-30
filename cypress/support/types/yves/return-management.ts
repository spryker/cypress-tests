import { Address, Customer, ProductConcrete, User } from './shared';

export interface ReturnCreationStorefrontDynamicFixtures {
  rootUser: User;
  customer: Customer;
  address: Address;
  firstReturnedProduct: ProductConcrete;
  secondReturnedProduct: ProductConcrete;
  keptProduct: ProductConcrete;
}

export interface ReturnCreationStorefrontStaticFixtures {
  defaultPassword: string;
  returnDetailsTitle: string;
  waitingForReturnState: string;
  shippedState: string;
}
