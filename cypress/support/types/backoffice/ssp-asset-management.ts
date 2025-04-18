import { User } from './shared';

export interface SspAssetStaticFixtures {
  defaultPassword: string;
  sspAsset: SspAsset;
  sspAssetOverride: SspAsset;
  statuses: Status[];
}

export interface SspAssetDynamicFixtures {
  rootUser: User;
  businessUnit1: BusinessUnit;
  businessUnit2: BusinessUnit;
  businessUnit3: BusinessUnit;
  company1: Company;
  company2: Company;
  // sspAsset: SspAsset;

  // generalSspInquiry: SspInquiry;
  // generalSspInquiry2: SspInquiry;
  // generalSspInquiry3: SspInquiry;
  // orderSspInquiry: OrderSspInquiry;
  customer: Customer;
  // company: Company;
  // businessUnit: BusinessUnit;
}

export interface SspAsset {
  id_ssp_asset?: number;
  reference: string;
  serial_number: string;
  name: string;
  note?: string;
  image?: string;
  status?: string;
}
//
// export interface SspInquiry {
//   id_ssp_inquiry: number;
//   reference: string;
//   subject: string;
//   description: string;
//   status: string;
//   type: string;
//   store: Store;
//   files: File[];
// }
//
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

export interface Status {
  key: string;
  value: string;
}
//
// export interface Store {
//   name: string;
// }
//
// export interface File {
//   file_name: string;
//   file_info: FileInfo[];
// }
//
// export interface FileInfo {
//   extension: string;
//   size: number;
// }
//
// export interface OrderSspInquiry extends SspInquiry {
//   order: Order;
// }
//
// export interface Order {
//   order_reference: string;
// }
