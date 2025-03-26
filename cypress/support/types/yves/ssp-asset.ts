export interface SspAssetStaticFixtures {
  asset: SspAsset;
  defaultPassword: string;
    assetUpdateData: SspAsset;
}

export interface SspAssetDynamicFixtures {
  customer: Customer;
    businessUnit: BusinessUnit;
  companyUser1BU1C1: CompanyUser;
  companyUser2BU1C1: CompanyUser;
  companyUser2BU2C1: CompanyUser;
  companyUser3BU1C2: CompanyUser;
  asset: SspAsset;
    assetBU1C1BU2C1BU1C2: SspAsset;
  assetBU1C2: SspAsset;
  assetBU2C1: SspAsset;
  assetBU1C1: SspAsset;
  businessUnit1Company1: BusinessUnit;
  businessUnit2Company1: BusinessUnit;
  businessUnit1Company2: BusinessUnit;
    sspInquiry1: SspInquiry;
    sspInquiry3: SspInquiry;
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
  serial_number: string;
    image: string;
}

export interface CompanyUser {
  id_company_user: number;
  customer: Customer;
}

interface BusinessUnit {
  name: string;
}

interface SspInquiry {
    reference: string;
}
