import { Customer } from './shared';

export interface SspInquirySmokeStaticFixtures {
  defaultPassword: string;
  customer: Customer;
  generalSspInquiry: SspInquiry;
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

export interface SspInquiryFile {
  name: string;
  size: string;
  extension: string;
}

export interface SspInquiryType {
  key: string;
  value: string;
}

export interface SspInquiryTypes {
  general: SspInquiryType[];
}

export interface File {
  name: string;
  size: string;
  extension: string;
}

export interface SspModelCreateSmokeStaticFixtures {
  defaultPassword: string;
  rootUser: {
    username: string;
  };
  sspModel: {
    name: string;
    code: string;
    image?: string;
  };
}

export interface SspFileUploadSmokeStaticFixtures {
  defaultPassword: string;
  rootUser: {
    username: string;
  };
  file: string;
  uploadedFileName: string;
}
