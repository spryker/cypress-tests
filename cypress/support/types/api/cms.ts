import { Store, User } from './shared';

export interface CmsPageSearchDmsDynamicFixtures {
  rootUser: User;
}

export interface CmsPageSearchDmsStaticFixtures {
  defaultPassword: string;
  store: Store;
  cmsPageName: string;
}
