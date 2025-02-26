import { Customer } from './shared';

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
  sspAsset: SspAsset;
}

export interface ClaimStaticFixtures {
  defaultPassword: string;
  generalClaim: Claim;
  orderClaim: Claim;
  sspAssetClaim: Claim;
  claimTypes: ClaimTypes;
}

export interface Claim {
  subject: string;
  description: string;
  files: File[];
  availableTypes: ClaimType[];
  type: ClaimType;
  status: string;
}

export interface Order {
  id_sales_order: number;
  order_reference: string;
}

export interface ClaimTypes {
  general: ClaimType[];
  order: ClaimType[];
  ssp_asset: ClaimType[];
}

export interface ClaimType {
  key: string;
  value: string;
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

export interface SspAsset {
  reference: string;
}
