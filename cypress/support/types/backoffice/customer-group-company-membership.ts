import { Company, CompanyBusinessUnit, User } from './shared';

export interface CustomerGroupCompanyMembershipStaticFixtures {
  defaultPassword: string;
}

export interface CustomerGroupCompanyMembershipDynamicFixtures {
  rootUser: User;
  customer: CustomerGroupCompanyMembershipCustomer;
  company: Company;
  businessUnit: CompanyBusinessUnit;
  companyToKeep: Company;
  businessUnitToKeep: CompanyBusinessUnit;
  customerGroupWithMemberships: CustomerGroupCompanyMembershipCustomerGroup;
  newCustomerGroup: { name: string };
}

interface CustomerGroupCompanyMembershipCustomer {
  id_customer: number;
  email: string;
  last_name: string;
}

interface CustomerGroupCompanyMembershipCustomerGroup {
  id_customer_group: number;
  name: string;
}
