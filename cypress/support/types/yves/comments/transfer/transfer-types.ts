export interface Product {
  id_product_concrete: number;
  sku: string;
  abstract_sku: string;
}

export interface Quote {
  id_quote: number;
  name: string;
  customer_reference: string;
  uuid: string;
  totals: string;
  price_mode: string;
}

export interface Customer {
  email: string;
}
