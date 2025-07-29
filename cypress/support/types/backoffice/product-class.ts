import { User, ProductClass, Product } from './shared';

export interface ProductClassStaticFixtures {
  defaultPassword: string;
}

export interface ProductClassDynamicFixtures {
  rootUser: User;
  productClass: ProductClass;
  shipmentType: {
    name: string;
    id_shipment_type: number;
  };
  product: Product;
}
