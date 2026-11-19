import { Product, User } from './shared';

export interface ProductConfiguratorSetupProduct extends Product {
  id_product_concrete: number;
}

export interface ProductConfiguratorSetupStaticFixtures {
  defaultPassword: string;
  configuratorKey: string;
  fileName: string;
  savedMessage: string;
  missingCurrencyError: string;
  unknownFormatContent: string;
  configuratorNotFoundError: string;
}

export interface ProductConfiguratorSetupDynamicFixtures {
  rootUser: User;
  product: ProductConfiguratorSetupProduct;
}
