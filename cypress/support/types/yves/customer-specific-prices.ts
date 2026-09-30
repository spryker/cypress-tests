export interface CustomerSpecificPricesStaticFixtures {
  defaultPassword: string;
  defaultPriceCustomer: StaticCustomer;
  merchantPriceCustomer: StaticCustomer;
  product: PricedProduct;
}

interface StaticCustomer {
  email: string;
}

interface PricedProduct {
  abstractSku: string;
  concreteSku: string;

  // The abstract name carries the catalog card; the concrete name carries the cart line, and the
  // two differ in the B2B demo data.
  name: string;
  cartItemName: string;
  defaultPrice: string;
  merchantPrice: string;
}
