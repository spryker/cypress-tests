import { User, Product, Store } from './shared';

interface Attachment {
  label: string;
  url: string;
  sortOrder: number;
}

export interface ProductManagementStaticFixtures {
  defaultPassword: string;
  locales: Record<string, string>;
  attachments: Record<string, Attachment>;
}

export interface ProductManagementDynamicFixtures {
  storeAT: Store;
  storeDE: Store;
  rootUser: User;
  product: Product;
}
