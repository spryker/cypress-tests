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
  configurationFileContentType: string;
  fileName: string;
  savedMessage: string;
  setUpStatus: string;
  notSetUpStatus: string;
  noLastChange: string;
  templateSummaryItems: string[];
  templateSchemaVersion: string;
  templateGroupLabels: string[];
  templateRuleCount: number;
  templateFirstRuleText: string;
  savedConfigurationSummaryItems: string[];
  missingPrice: ProductConfiguratorSetupMissingPrice;
  missingPriceError: string;
  unknownFormatContent: string;
  configuratorNotFoundError: string;
  nameLocale: string;
  changedProductName: string;
}

export interface ProductConfiguratorSetupDynamicFixtures {
  rootUser: User;
  productForTemplate: ProductConfiguratorSetupProduct;
  productForDownload: ProductConfiguratorSetupProduct;
  productConfigurationForDownload: ProductConfiguratorSetupProductConfiguration;
  productForFailedUpload: ProductConfiguratorSetupProduct;
  productForUnknownFormat: ProductConfiguratorSetupProduct;
}
