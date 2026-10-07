import { Company, CompanyBusinessUnit, User } from './shared';

export interface CustomerGroupCompanyMembershipStaticFixtures {
  defaultPassword: string;
}

export interface CustomerGroupCompanyMembershipDynamicFixtures {
  rootUser: User;
  company: Company;
  businessUnit: CompanyBusinessUnit;
  companyToKeep: Company;
  businessUnitToKeep: CompanyBusinessUnit;
  customerGroup: CustomerGroupCompanyMembershipCustomerGroup;
  customerGroupWithMemberships: CustomerGroupCompanyMembershipCustomerGroup;
  newCustomerGroup: { name: string };
}

interface CustomerGroupCompanyMembershipCustomerGroup {
  id_customer_group: number;
  name: string;
}
