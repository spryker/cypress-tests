import { Address, Customer, Merchant, ProductConcrete, ProductOffer, User } from './shared';

export interface OfferAvailabilityDynamicFixtures {
  rootUser: User;
  orderingCustomer: Customer;

  // A second customer whose cart already holds the offer, so the reservation is read from a cart the
  // order did not consume.
  cartCustomer: Customer;
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
