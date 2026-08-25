import { Customer, ProductConcrete } from './shared';

export interface OriginalPriceStaticFixtures {
  defaultPassword: string;
  abstractPrice: DisplayedPrice;
  variant: PricedVariant;
}

interface DisplayedPrice {
  default: string;
  original: string;
}

interface PricedVariant extends DisplayedPrice {
  attributeKey: string;
  attributeValue: string;
}

export interface OriginalPriceDynamicFixtures {
  customer: Customer;
  product: ProductConcrete;
  discountedVariant: ProductConcrete;
}
