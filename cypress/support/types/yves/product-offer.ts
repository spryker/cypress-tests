import { Address, Customer, Merchant, ProductConcrete, ProductOffer, User } from './shared';

export interface OfferAvailabilityDynamicFixtures {
  rootUser: User;
  customer: Customer;
  address: Address;
  merchant: Merchant;
  merchantProduct: ProductConcrete;
  productOffer: ProductOffer;
}

export interface OfferAvailabilityStaticFixtures {
  defaultPassword: string;
  initialStock: number;
  orderedQuantity: number;
}
