import { User } from './shared';

export interface SspFileManagementStaticFixtures {
  defaultPassword: string;
}

export interface SspFileManagementDynamicFixtures {
  rootUser: User;
  sspAsset: SspAsset;
  businessUnit: BusinessUnit;
  companyUser: CompanyUser;
  company1: Company;
}

interface SspAsset {
  name: string;
}

interface BusinessUnit {
  name: string;
}

interface CompanyUser {
  customer: Customer;
}

interface Customer {
  first_name: string;
}

interface Company {
  name: string;
}
