import { Company, CompanyBusinessUnit, CompanyUser, Customer } from './shared';

export interface BusinessOnBehalfDynamicFixtures {
  customer: Customer;
  company: Company;
  firstBusinessUnit: CompanyBusinessUnit;
  secondBusinessUnit: CompanyBusinessUnit;
  firstCompanyUser: CompanyUser;
  secondCompanyUser: CompanyUser;
}

export interface BusinessOnBehalfStaticFixtures {
  defaultPassword: string;
}
