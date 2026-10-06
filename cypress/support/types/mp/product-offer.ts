import { Customer, Merchant, ProductConcrete, ProductOffer, User } from './shared';

export interface OfferVolumePricesDynamicFixtures {
  customer: Customer;
  merchantUser: User;
  merchant: Merchant;
  merchantProduct: ProductConcrete;
  productOffer: ProductOffer;
}

export interface OfferVolumePricesStaticFixtures {
  defaultPassword: string;
  offerPrice: string;
  volumeTier: VolumeTier;
}

interface VolumeTier {
  // The quantity from which the tier price applies, and a quantity above it that the storefront
  // is driven to.
  threshold: number;
  quantity: number;
  price: string;
}

export interface OfferCreationDynamicFixtures {
  customer: Customer;
  productMerchant: Merchant;
  offerMerchant: Merchant;
  offerMerchantUser: User;
  merchantProduct: ProductConcrete;
}

export interface OfferCreationStaticFixtures {
  defaultPassword: string;
  storeName: string;
  currency: string;
  offer: OfferUnderTest;
}

interface OfferUnderTest {
  netAmount: number;
  grossAmount: number;
  displayedPrice: string;
  stockQuantity: number;
}
