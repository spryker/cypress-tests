import { User, ProductAbstractType, ProductAbstract } from './shared';

export interface ProductAbstractTypeStaticFixtures {
  defaultPassword: string;
}

export interface ProductAbstractTypeDynamicFixtures {
  rootUser: User;
  productAbstractType: ProductAbstractType;
  productAbstract: ProductAbstract;
}
