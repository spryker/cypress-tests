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
