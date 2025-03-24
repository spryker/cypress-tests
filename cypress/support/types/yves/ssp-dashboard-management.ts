import { Customer } from './shared';

export interface SspDashboardManagementDynamicFixtures {
  customer: Customer;
}

export interface SspDashboardManagementStaticFixtures {
  defaultPassword: string;
}

export interface SspDashboardManagement {
  subject: string;
  description: string;
  files: File[];
  availableTypes: string[];
  type: string;
  status: string;
}
