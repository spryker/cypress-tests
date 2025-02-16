import { Customer, Store } from './shared';

export interface ClaimDynamicFixtures {
  customer: Customer;
  customer2: Customer;
  customer3: Customer;
  customer4: Customer;
  customer5: Customer;
  customer6: Customer;
  order: Order;
  company: Company;
  businessUnit: BusinessUnit;
}

export interface ClaimStaticFixtures {
  defaultPassword: string;
  generalClaim: Claim;
  orderClaim: Claim;
  claimTypes: ClaimTypes;
}

export interface Claim {
  subject: string;
  description: string;
  files: File[];
  availableTypes: string[];
  type: string;
  status: string;
}

export interface Order {
  id_sales_order: number;
  order_reference: string;
}

export interface ClaimTypes {
  general: string[];
  order: string[];
}

export interface Company {
  name: string;
}

export interface BusinessUnit {
  name: string;
}

export interface File {
  name: string;
  size: string;
  extension: string;
}
