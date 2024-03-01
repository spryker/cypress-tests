export interface User {
  username: string;
  first_name: string;
  last_name: string;
}

export interface Merchant {
  name: string;
}

export interface Customer {
  email: string;
}

export interface ProductConcrete {
  sku: string;
  abstract_sku: string;
}

export interface ProductOffer {
  product_offer_reference: string;
}
