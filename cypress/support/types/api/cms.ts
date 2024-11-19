import { CmsPage, Store, User } from './shared';

export interface CmsPageCreationDynamicFixtures {
  rootUser: User;
  cmsPage: CmsPage;
}
export interface CmsPageCreationStaticFixtures {
  defaultPassword: string;
  store: Store;
  cmsPageName: string;
}
