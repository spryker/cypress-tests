import { User } from './shared';

export interface ServicePointManagementStaticFixtures {
  defaultPassword: string;
  servicePointAddress: {
    address1: string;
    address2: string;
    city: string;
    zipCode: string;
  };
}

export interface ServicePointManagementDynamicFixtures {
  rootUser: User;
  store: {
    name: string;
  };
  servicePoint: {
    id_service_point: number;
    name: string;
    key: string;
  };
  serviceType: {
    name: string;
  };
  service: {
    key: string;
  };
  product: {
    sku: string;
  };
  productOffer: {
    product_offer_reference: string;
  };
}
