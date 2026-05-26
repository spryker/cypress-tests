import { Customer } from './shared';

export interface SspAsset {
  name: string;
  serial_number?: string;
  note?: string;
  image?: string;
}

export interface SspAssetCreateSmokeStaticFixtures {
  defaultPassword: string;
  customer: Customer;
  asset: SspAsset;
}

export interface SspInquiryFile {
  name: string;
  size: string;
  extension: string;
}

export interface SspInquiry {
  subject: string;
  description: string;
  file: SspInquiryFile;
}

export interface SspInquiryCreateSmokeStaticFixtures {
  defaultPassword: string;
  customer: Customer;
  inquiry: SspInquiry;
}
