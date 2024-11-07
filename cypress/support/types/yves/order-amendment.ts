import { Address, Customer, ProductConcrete, User } from './shared';

export interface OrderAmendmentCancelDynamicFixtures {
  customer: Customer;
  address: Address;
  product: ProductConcrete;
}

export interface OrderAmendmentFinishDynamicFixtures {
  customer1: Customer;
  address1: Address;

  customer2: Customer;
  address2: Address;

  product1: ProductConcrete;
  product2: ProductConcrete;
}

export interface OrderAmendmentStartDynamicFixtures {
  rootUser: User;

  customer1: Customer;
  address1: Address;

  customer2: Customer;
  address2: Address;

  customer3: Customer;
  address3: Address;

  customer4: Customer;
  address4: Address;

  customer5: Customer;
  address5: Address;

  product: ProductConcrete;
}

export interface OrderAmendmentStaticFixtures {
  defaultPassword: string;
}
