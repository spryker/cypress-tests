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
  bundledStockQuantity: number;
  bundleQuantity: number;
}

export interface ProductsDynamicFixtures {
  product: {
    abstract_sku: string;
    sku: string;
    id_product_concrete: number;
    fk_product_abstract: number;
  };
  bundled: {
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
  productClass: {
    id_product_class: number;
    key: string;
  };
}
