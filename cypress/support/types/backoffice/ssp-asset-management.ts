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

interface SspAsset {
  id_ssp_asset?: number;
  reference: string;
  serial_number: string;
  name: string;
  note?: string;
  image?: string;
  status?: string;
}

interface Customer {
  first_name: string;
  last_name: string;
  email: string;
  salutation: string;
}

interface Company {
  name: string;
}

interface BusinessUnit {
  name: string;
}

interface Status {
  key: string;
  value: string;
}
