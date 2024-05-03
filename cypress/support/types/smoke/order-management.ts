import { Address, Customer, Product, ProductConcrete, ProductOffer, User } from './shared';

export interface DummyPaymentOmsFlowStaticFixtures {
  defaultPassword: string;
  customer: Customer;
  product: Product;
  rootUser: User;
}

export interface MarketplacePaymentOmsFlowStaticFixtures {
  defaultPassword: string;
  rootUser: User;
  merchantUser: User;
  customer: Customer;
  address: Address;
  productConcreteForOffer: ProductConcrete;
  productOffer: ProductOffer;
}
