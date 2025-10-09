import { User } from './shared';

export interface SspInquiryStaticFixtures {
  defaultPassword: string;
}

export interface SspInquiryDynamicFixtures {
  rootUser: User;
  generalSspInquiry: SspInquiry;
  generalSspInquiry2: SspInquiry;
  generalSspInquiry3: SspInquiry;
  orderSspInquiry: OrderSspInquiry;
  customer: Customer;
  company: Company;
  businessUnit: BusinessUnit;
}

export interface SspInquiry {
  id_ssp_inquiry: number;
  reference: string;
  subject: string;
  description: string;
  status: string;
  type: string;
  files: File[];
}

export interface Customer {
  first_name: string;
  last_name: string;
  email: string;
  salutation: string;
}

export interface Company {
  name: string;
}

export interface BusinessUnit {
  name: string;
}

export interface Store {
  name: string;
}

export interface File {
  file_name: string;
  file_info: FileInfo[];
}

export interface FileInfo {
  extension: string;
  size: number;
}

export interface OrderSspInquiry extends SspInquiry {
  order: Order;
}

export interface Order {
  order_reference: string;
}
