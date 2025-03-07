import { Customer } from './shared';

export interface SspInquiryDynamicFixtures {
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

export interface SspInquiryStaticFixtures {
  defaultPassword: string;
  generalSspInquiry: SspInquiry;
  orderSspInquiry: SspInquiry;
  sspAssetSspInquiry: SspInquiry;
  sspInquiryTypes: SspInquiryTypes;
}

export interface SspInquiry {
  subject: string;
  description: string;
  files: File[];
  availableTypes: SspInquiryType[];
  type: SspInquiryType;
  status: string;
}

export interface Order {
  id_sales_order: number;
  order_reference: string;
}

export interface SspInquiryTypes {
  general: SspInquiryType[];
  order: SspInquiryType[];
  ssp_asset: SspInquiryType[];
}

export interface SspInquiryType {
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
