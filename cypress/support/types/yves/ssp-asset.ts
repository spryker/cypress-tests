export interface SspAssetStaticFixtures {
  asset: SspAsset;
  defaultPassword: string;
}

export interface SspAssetDynamicFixtures {
  customer: Customer;
    customerWithViewCompanyAssetPermission: Customer;
  asset: SspAsset;
}

export interface SspAsset {
  reference: string;
  name: string;
  note?: string;
}

export interface Customer {
  email: string;
}

export interface SspAsset {
  reference: string;
  name: string;
}
