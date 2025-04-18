import { User } from './shared';

export interface SspAssetStaticFixtures {
  defaultPassword: string;
  sspAsset: SspAsset;
  sspAssetOverride: SspAsset;
  statuses: Status[];
}

export interface SspAssetDynamicFixtures {
  rootUser: User;
  businessUnit1: BusinessUnit;
  businessUnit2: BusinessUnit;
  businessUnit3: BusinessUnit;
  company1: Company;
  company2: Company;
  customer: Customer;
}

export interface SspAsset {
  id_ssp_asset?: number;
  reference: string;
  serial_number: string;
  name: string;
  note?: string;
  image?: string;
  status?: string;
}

export interface Customer {
  first_name: string;
  last_name: string;
  email: string;
  salutation: string;
}

export interface Company {
  name: string;
}

export interface BusinessUnit {
  name: string;
}

export interface Status {
  key: string;
  value: string;
}
