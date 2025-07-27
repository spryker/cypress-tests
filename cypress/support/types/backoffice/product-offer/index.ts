export interface ProductOfferStaticFixtures {
  defaultPassword: string;
  productConcrete: {
    productClass: string;
  };
}

export interface ProductOfferDynamicFixtures {
  rootUser: {
    username: string;
  };
  productClass: {
    id_product_class: number;
    name: string;
  };
  store: {
    name: string;
    id_store: number;
  };
  servicePoint: {
    id_service_point: number;
  };
  service: {
    uuid: string;
  };
}
