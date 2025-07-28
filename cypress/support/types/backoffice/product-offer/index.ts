export interface ProductOfferStaticFixtures {
  defaultPassword: string;
  productConcrete: {
    productClass: string;
  };
  defaultApprovalStatus: string;
  defaultStatus: string;
  defaultMerchantName: string;
  defaultStockName: string;
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
  service: {
    uuid: string;
  service_point: {
    id_service_point: number;
    key: string;
    name: string;
    serviceType: {
      name: string;
    };
  };
  service_type: {
    name: string;
  };
}
}
