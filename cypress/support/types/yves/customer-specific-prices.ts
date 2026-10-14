import { Customer, ProductConcrete } from './shared';

// Where demo data backs the scenario the static fixture names the product and both customers;
// elsewhere the dynamic fixture creates them and the static one carries only the prices it seeds.
export type CustomerSpecificPricesStaticFixtures = PricesStaticFixtures | DemoDataStaticFixtures;

export interface CustomerSpecificPricesDynamicFixtures {
  defaultPriceCustomer: Customer;
  merchantPriceCustomer: Customer;
  product: ProductConcrete;
}

export interface CustomerSpecificPricesCustomer {
  email: string;
  alternativeEmails?: string[];
}

export interface CustomerSpecificPricesProduct {
  abstractSku: string;
  concreteSku: string;

  // The abstract name carries the catalog card; the concrete name carries the cart line, and the
  // two differ in the B2B demo data.
  name: string;
  cartItemName: string;
}

interface PricesStaticFixtures {
  defaultPassword: string;
  prices: Prices;
}

interface DemoDataStaticFixtures extends PricesStaticFixtures {
  defaultPriceCustomer: CustomerSpecificPricesCustomer;
  merchantPriceCustomer: CustomerSpecificPricesCustomer;
  product: CustomerSpecificPricesProduct;
}

interface Prices {
  defaultPrice: string;
  merchantPrice: string;
}
