export interface ProductConcrete {
  sku: string;
  abstract_sku: string;
  fk_product_abstract: number;
  localized_attributes: { name: string }[];
}
