import { Customer, File } from './shared';

export interface SspFileManagementDynamicFixtures {
  customer: Customer;
    customer2: Customer;
    customer3: Customer;
  file1: File;
  file2: File;
  file3: File;
  fileSspAsset: FileAttach;
    sspAsset: SspAsset;
    companyUser: CompanyUser;
    companyUserBU1C2: CompanyUser;
    companyUserBU2C2: CompanyUser;
    companyUserBU1C3: CompanyUser;
}

export interface SspFileManagementStaticFixtures {
  defaultPassword: string;
  filter_type_file: string;
  filter_value_pdf: string;
  filter_value_jpeg: string;
  prompt_img: string;
  prompt_doc: string;
  prompt_nonexistent: string;
}

interface SspAsset {
    reference: string;
}

interface FileAttach extends File {
    uuid: string;
}

interface CompanyUser {
    id_company_user: number;
}
