import { User } from './shared';

export interface ApiSpecificationDownloadStaticFixtures {
  defaultPassword: string;
}

export interface ApiSpecificationDownloadDynamicFixtures {
  rootUser: User;
}
