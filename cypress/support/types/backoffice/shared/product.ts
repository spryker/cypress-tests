export interface Product {
  sku: string;
  name: string;
  abstract_sku: string;
  localized_attributes: [
    {
      name: string;
    },
  ];
}
