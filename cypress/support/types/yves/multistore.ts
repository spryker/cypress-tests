import { User } from './shared';

export interface MultistoreCmsPageDynamicFixtures {
  rootUser: User;
}

export interface MultistoreCmsPageStaticFixtures {
  defaultPassword: string;
  cmsPageName: string;
  storeName: string;
}
