import { ProductLocalizedAttributes } from './product-localized-attributes';

export interface ProductConcrete {
  id_product_concrete: number;
  sku: string;
  abstract_sku: string;
  name: string;
  localized_attributes: ProductLocalizedAttributes[];
}
