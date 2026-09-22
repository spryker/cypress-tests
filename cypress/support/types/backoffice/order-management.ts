import { Address, Customer, PaymentMethod, Product, Store, User } from './shared';

export interface OrderCreationDynamicFixtures {
  customer: Customer;
  address: Address;
  product: Product;
  rootUser: User;
}

export interface OrderManagementStaticFixtures {
  defaultPassword: string;
}

export interface CustomOrderReferenceManagementDynamicFixtures {
  customer: Customer;
  rootUser: User;
}

export interface CustomOrderReferenceManagementStaticFixtures {
  defaultPassword: string;
  orderReference: string;
}

export interface OrderCreationDmsDynamicFixtures {
  customer: Customer;
  address: Address;
  product: Product;
  rootUser: User;
}

export interface OrderManagementDmsStaticFixtures {
  defaultPassword: string;
  store: Store;
  paymentMethods: PaymentMethod[];
}

export interface OmsReservationFlowDynamicFixtures {
  customer: Customer;
  address: Address;
  productShipment: Product;
  productCancellation: Product;
  salesOrderShipment: { id_sales_order: number; order_reference: string };
  salesOrderCancellation: { id_sales_order: number; order_reference: string };
  rootUser: User;
}

export interface OmsReservationFlowStaticFixtures {
  defaultPassword: string;
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
}
