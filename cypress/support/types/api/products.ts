export interface ProductsStaticFixtures {
  storeName: string;
  currencyCode: string;
  priceTypeName: string;
  localeName: string;
  stockName: string;
  superAttributeKey: string;
  concreteAttributeKey: string;
  concreteAttributeValue: string;
  netAmount: number;
  grossAmount: number;
}

export interface ProductsDynamicFixtures {
  product: {
    abstract_sku: string;
    sku: string;
    id_product_concrete: number;
    fk_product_abstract: number;
  };
  taxSet: {
    id_tax_set: number;
    name: string;
    uuid?: string;
  };
  category: {
    id_category: number;
  };
  shipmentType: {
    uuid: string;
  };
}

export interface ProductsBundleStaticFixtures {
  storeName: string;
  currencyCode: string;
  priceTypeName: string;
  localeName: string;
  stockName: string;
  bundledStockQuantity: number;
  bundleQuantity: number;
  netAmount: number;
  grossAmount: number;
}

export interface ProductsBundleDynamicFixtures {
  bundled: {
    abstract_sku: string;
    sku: string;
    id_product_concrete: number;
    fk_product_abstract: number;
  };
}
