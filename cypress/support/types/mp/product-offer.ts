import { Customer, Merchant, ProductConcrete, ProductOffer, User } from './shared';

interface ProductOfferPrice {
  id_price_product_offer: number;
}

export interface OfferVolumePricesDynamicFixtures {
  customer: Customer;
  merchantUser: User;
  merchant: Merchant;
  merchantProduct: ProductConcrete;
  productOffer: ProductOffer;
  productOfferPrice: ProductOfferPrice;
  editableProductOffer: ProductOffer;
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
  // The B2B marketplace cart shows only the item total, the other shops the unit price as well.
  cartPrice: string;
}

export interface OfferCreationDynamicFixtures {
  customer: Customer;
  productMerchant: Merchant;
  offerMerchant: Merchant;
  offerMerchantUser: User;
  merchantProduct: ProductConcrete;
  offeredProduct: ProductConcrete;
  productOffer: ProductOffer;
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
