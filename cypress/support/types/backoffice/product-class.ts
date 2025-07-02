import { User, ProductClass, Product } from './shared';

export interface ProductClassStaticFixtures {
  defaultPassword: string;
}

export interface ProductClassDynamicFixtures {
  rootUser: User;
  productClass: ProductClass;
  product: Product;
}
