export interface SspAssetStaticFixtures {
  asset: SspAsset;
  defaultPassword: string;
}

export interface SspAssetDynamicFixtures {
  customer: Customer;
  asset: SspAsset;
}

export interface SspAsset {
  name: string;
}

export interface Customer {
  email: string;
}

export interface SspAsset {
  reference: string;
  name: string;
}
