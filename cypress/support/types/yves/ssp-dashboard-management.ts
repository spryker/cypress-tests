import { Customer, Company } from './shared';

export interface SspDashboardManagementDynamicFixtures {
  customer: Customer;
  customer2: Customer;
  customer3: Customer;
  customer4: Customer;
  company: Company;
  businessUnit: BusinessUnit;
  cmsBlockGlossary: CmsBlockGlossary;
  locale: Locale;
  sspAsset: SspAsset;
  sspAsset1: SspAsset;
  file: SspFile;
  file1: SspFile;
  file2: SspFile;
  file3: SspFile;
  sspInquiry: SspInquiry;
  sspInquiry1: SspInquiry;
  sspInquiry2: SspInquiry;
  sspInquiry3: SspInquiry;
}

export interface SspDashboardManagementStaticFixtures {
  defaultPassword: string;
}

interface BusinessUnit {
  name: string;
}

export interface SspFile {
  file_name: string;
  file_info: SspFileInfo[];
}

export interface SspFileInfo {
  extension: string;
}

export interface CmsBlockGlossary {
  glossary_placeholders: GlossaryPlaceholders[];
}

export interface GlossaryPlaceholders {
  translations: GlossaryPlaceholderTranslations[];
}

export interface GlossaryPlaceholderTranslations {
  fk_locale: number;
  translation: string;
}

interface Locale {
  id_locale: number;
}

interface SspInquiry {
  subject: string;
  description: string;
  reference: string;
  type: string;
  availableTypes: SspInquiryType[];
  status: string;
}

interface SspInquiryType {
  key: string;
  value: string;
}

interface SspAsset {
  reference: string;
  name: string;
  serial_number: string;
  image: string;
}
