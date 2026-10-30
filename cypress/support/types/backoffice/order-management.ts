import { Address, Customer, Product, User } from './shared';

export interface OrderCreationDynamicFixtures {
  customer: Customer;
  address: Address;
  product: Product;
  rootUser: User;
}

export interface OrderCreationDmsDynamicFixtures {
  customer: Customer;
  address: Address;
  product: Product;
  rootUser: User;
}

export interface OrderRefundDynamicFixtures {
  rootUser: User;
  customer: Customer;
  address: Address;
  firstRefundedProduct: Product;
  secondRefundedProduct: Product;
  thirdRefundedProduct: Product;
}

export interface OrderRefundStaticFixtures {
  defaultPassword: string;
}

export interface ShipmentManagementDynamicFixtures {
  rootUser: User;
  customer: Customer;
  address: Address;
  keptProduct: Product;
  movedProduct: Product;
  reassignedProduct: Product;
}

export interface ShipmentManagementStaticFixtures {
  defaultPassword: string;
  newShipmentAddress: ShipmentAddressFixture;
  editedShipmentAddress: ShipmentAddressFixture;
}

export interface ShipmentAddressFixture {
  salutation: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  address1: string;
  address2: string;
  city: string;
  zipCode: string;
}

export interface ConfigurableProductOmsDynamicFixtures {
  rootUser: User;
  customer: Customer;
  address: Address;
  product: Product;
}

export interface ConfigurableProductOmsStaticFixtures {
  defaultPassword: string;
  configurationNotCompleteStatus: string;
  configurationCompleteStatus: string;
  orderShippingEvents: Array<{ state: string; shouldTriggerOmsInCli?: boolean }>;
}
