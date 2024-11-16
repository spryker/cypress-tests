import { Address, Customer, Product, User, ProductConcrete, ProductOffer, Store } from './shared';

export interface OrderCreationDynamicFixtures {
  customer: Customer;
  address: Address;
  product: Product;
  rootUser: User;
}

export interface OrderManagementStaticFixtures {
  defaultPassword: string;
}

export interface OrderManagementDynamicFixtures {
  customer: Customer;
}

export interface CustomOrderReferenceManagementDynamicFixtures {
  customer: Customer;
  rootUser: User;
}

export interface CustomOrderReferenceManagementStaticFixtures {
  defaultPassword: string;
  orderReference: string;
}

export interface MarketplacePaymentOmsFlowStaticFixtures {
  defaultPassword: string;
  merchantUser: User;
  customer: Customer;
  address: Address;
  productConcreteForOffer: ProductConcrete;
  productOffer: ProductOffer;
  store: Store;
  product: Product;
  cmsBlockNames: Array<string>;
  warehouse1: string;
  warehouse2: string;
  paymentMethod: PaymentMethod;
  productPrice: string;
  shipmentMethod: ShipmentMethod;
  merchantName1: string;
  merchantName2: string;
}

export interface MarketplacePaymentOmsFlowDynamicFixtures {
  rootUser: User;
}

export interface DummyPaymentOmsFlowStaticFixtures {
    store: Store;
    cmsBlockNames: Array<string>;
    defaultPassword: string;
    customer: Customer;
    product: Product;
    productConcrete: ProductConcrete;
    warehouse: string;
    paymentMethod: PaymentMethod;
    productPrice: string;
    shipmentMethod: ShipmentMethod;
    concreteProduct: ProductConcrete;
    checkoutPaymentMethod: string;
}

export interface DummyPaymentOmsFlowDynamicFixtures {
    rootUser: User;
}

export interface ShipmentMethod {
    key: string;
    name: string;
}

export interface PaymentMethod {
    key: string;
    name: string;
}
