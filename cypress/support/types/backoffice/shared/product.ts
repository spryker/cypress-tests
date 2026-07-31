export interface Product {
  sku: string;
  name: string;
  abstract_sku: string;
  fk_product_abstract: number;
  localized_attributes: [
    {
      name: string;
    },
  ];
}
