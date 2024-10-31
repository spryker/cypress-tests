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
  rootUser: User;
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
  paymentMethod: string;
  productPrice: string;
  shipmentMethod: string;
  merchantName1: string;
  merchantName2: string;
}
