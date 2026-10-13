import { Customer, ProductConcrete } from './shared';

export interface VolumePricesStaticFixtures {
  defaultPassword: string;
  unitPrice: string;
  volumeTier: VolumeTier;

  // Two quantities that each stay below the tier and together reach it.
  belowTierQuantities: BelowTierQuantities;
}

interface BelowTierQuantities {
  first: number;
  second: number;
}

interface VolumeTier {
  quantity: number;
  price: string;
}

export interface VolumePricesDynamicFixtures {
  customer: Customer;
  product: ProductConcrete;
}
