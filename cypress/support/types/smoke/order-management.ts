import { Address, Customer, Product, ProductConcrete, ProductOffer, User } from './shared';

export interface DummyPaymentOmsFlowStaticFixtures {
  store: Store;
  cmsBlockNames: Array<string>;
  defaultPassword: string;
  customer: Customer;
  product: Product;
  rootUser: User;
  productConcrete: ProductConcrete;
  warehouse: string;
  paymentMethod: string;
  productPrice: string;
  shipmentMethod: string;
  concreteProduct: ProductConcrete;
}

export interface Store {
  name: string;
  locale: string;
  currency: string;
  country: string;
  timezone: string;
}

export interface MarketplacePaymentOmsFlowStaticFixtures {
  defaultPassword: string;
  rootUser: User;
  merchantUser: User;
  customer: Customer;
  address: Address;
  productConcreteForOffer: ProductConcrete;
  productOffer: ProductOffer;
  warehouse: string;
}
