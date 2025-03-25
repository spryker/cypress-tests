import { Customer } from './shared';
import {Company} from "./ssp-inquiry";

export interface SspDashboardManagementDynamicFixtures {
  customer: Customer;
  company: Company;
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
