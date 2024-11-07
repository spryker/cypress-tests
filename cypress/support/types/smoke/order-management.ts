import { Address, Customer, Product, ProductConcrete, ProductOffer, User } from './shared';

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
