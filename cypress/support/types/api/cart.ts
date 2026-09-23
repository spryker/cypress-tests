export interface CartConfigurableProductVolumePrice {
  netAmount: number;
  grossAmount: number;
  quantity: number;
}

export interface CartConfigurableProductPrice {
  priceTypeName: string;
  netAmount: number;
  grossAmount: number;
  currency: {
    code: string;
    name: string;
    symbol: string;
  };
  volumePrices?: CartConfigurableProductVolumePrice[];
}

export interface CartConfigurableProductStaticFixtures {
  defaultPassword: string;
  store: string;
  currency: string;
  priceMode: string;
  configuratorKey: string;
  configuration: string;
  displayData: string;
  quantity: number;
  availableQuantity: number;
  prices: CartConfigurableProductPrice[];
}

export interface CartConfigurableProductDynamicFixtures {
  customer: {
    id_customer: number;
    email: string;
  };
  configurableProduct: {
    sku: string;
    idProductConcrete: number;
  };
}
