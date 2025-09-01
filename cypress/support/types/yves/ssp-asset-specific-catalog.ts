import { Customer, SspAsset, ProductConcrete } from './shared';

export interface SspAssetSpecificCatalogStaticFixtures {
  defaultPassword: string;
}

export interface SspAssetSpecificCatalogDynamicFixtures {
  customer: Customer;
  sspAsset: SspAsset;
  productSpareParts: ProductConcrete;
  productService: ProductConcrete;
}