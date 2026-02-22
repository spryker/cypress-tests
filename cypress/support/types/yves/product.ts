import { Attachment, Customer, Store, User, Locale } from './shared';
import { Product } from '../backoffice/shared';

export interface PublishAndSynchronizeStaticFixtures {
  defaultPassword: string;
}

export interface PublishAndSynchronizeDynamicFixtures {
  customer: Customer;
  rootUser: User;
}

export interface PublishAndSynchronizeDmsStaticFixtures {
  defaultPassword: string;
  store: Store;
}

export interface PublishAndSynchronizeDmsDynamicFixtures {
  rootUser: User;
  customer: Customer;
}

export interface ProductAttachmentStorefrontStaticFixtures {
  defaultPassword: string;
  defaultLocaleName: string;
  attachments: Record<string, Attachment>;
  deStorefront: string;
}

export interface ProductAttachmentStorefrontDynamicFixtures {
  storeAT: Store;
  storeDE: Store;
  rootUser: User;
  product: Product;
  localeEN: Locale;
  localeDE: Locale;
}
