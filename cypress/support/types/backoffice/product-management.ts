import { User, Product, Store, Locale, Attachment } from './shared';

export interface ProductManagementStaticFixtures {
  defaultPassword: string;
  defaultLocaleName: string;
  attachments: Record<string, Attachment>;
}

export interface ProductManagementDynamicFixtures {
  storeAT: Store;
  storeDE: Store;
  rootUser: User;
  product: Product;
  localeEN: Locale;
  localeDE: Locale;
}
