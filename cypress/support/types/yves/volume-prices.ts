import { Customer, ProductConcrete } from './shared';

export interface VolumePricesStaticFixtures {
  defaultPassword: string;
  unitPrice: string;
  volumeTier: VolumeTier;

  belowTierQuantity: number;
}

interface VolumeTier {
  quantity: number;
  price: string;
}

export interface VolumePricesDynamicFixtures {
  customer: Customer;
  product: ProductConcrete;
}
