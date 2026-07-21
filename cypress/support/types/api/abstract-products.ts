export interface AbstractProductsStaticFixtures {
  storeName: string;
  currencyCode: string;
  priceTypeName: string;
  superAttributeKey: string;
  netAmount: number;
  grossAmount: number;
}

export interface AbstractProductsDynamicFixtures {
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
}
