import { Customer, Store, User } from './shared';

export interface CmsPageSearchDmsDynamicFixtures {
  rootUser: User;
  customer: Customer;
}

export interface CmsPageSearchDmsStaticFixtures {
  defaultPassword: string;
  store: Store;
  cmsPageName: string;
}
