export interface SspAssetStaticFixtures {
  asset: SspAsset;
  defaultPassword: string;
}

export interface SspAssetDynamicFixtures {
  customer: Customer;
  companyUser1BU1C1: CompanyUser;
  companyUser2BU1C1: CompanyUser;
  companyUser2BU2C1: CompanyUser;
  companyUser3BU1C2: CompanyUser;
  asset: SspAsset;
  assetBU1C1BU2C1: SspAsset;
  assetBU1C2: SspAsset;
  businessUnit1Company1: BusinessUnit;
  businessUnit2Company1: BusinessUnit;
  businessUnit1Company2: BusinessUnit;
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

export interface CompanyUser {
  id_company_user: number;
  customer: Customer;
}

interface BusinessUnit {
  name: string;
}
