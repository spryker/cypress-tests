import { Product, User } from './shared';

export interface ProductConfiguratorSetupProduct extends Product {
  id_product_concrete: number;
}

export interface ProductConfiguratorSetupProductConfiguration {
  default_configuration: string;
}

export interface ProductConfiguratorSetupMissingPrice {
  groupIndex: number;
  optionIndex: number;
  currency: string;
}

export interface ProductConfiguratorSetupStaticFixtures {
  defaultPassword: string;
  configuratorKey: string;
  configurationFileExtension: string;
  fileName: string;
  savedMessage: string;
  setUpStatus: string;
  notSetUpStatus: string;
  noLastChange: string;
  templateSummaryItems: string[];
  savedConfigurationSummaryItems: string[];
  missingPrice: ProductConfiguratorSetupMissingPrice;
  missingPriceError: string;
  unknownFormatContent: string;
  configuratorNotFoundError: string;
  nameLocale: string;
  changedProductName: string;
  accessDeniedTitle: string;
}

export interface ProductConfiguratorSetupDynamicFixtures {
  rootUser: User;
  configuratorSetupDeniedUser: User;
  productWithoutConfiguration: ProductConfiguratorSetupProduct;
  productForTemplate: ProductConfiguratorSetupProduct;
  productForDownload: ProductConfiguratorSetupProduct;
  productConfigurationForDownload: ProductConfiguratorSetupProductConfiguration;
  productForInvalidConfiguration: ProductConfiguratorSetupProduct;
  productForFailedUpload: ProductConfiguratorSetupProduct;
  productForUnknownFormat: ProductConfiguratorSetupProduct;
  productForAccessCheck: ProductConfiguratorSetupProduct;
}
