import { Customer, Company } from './shared';

export interface SspDashboardManagementDynamicFixtures {
  customer: Customer;
  customer2: Customer;
  company: Company;
  businessUnit: BusinessUnit;
  cmsBlockGlossary: CmsBlockGlossary;
  locale: Locale;
}

export interface BusinessUnit {
    name: string;
}

export interface File {
    name: string;
    size: string;
    extension: string;
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

export interface CmsBlockGlossary {
  glossary_placeholders: GlossaryPlaceholders[]
}

export interface GlossaryPlaceholders {
  translations: GlossaryPlaceholderTranslations[]
}

export interface GlossaryPlaceholderTranslations {
  fk_locale: number;
  translation: string;
}

export interface Locale {
    id_locale: number
}
