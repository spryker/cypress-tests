import { User } from './shared';

export interface ApiSpecificationDownloadStaticFixtures {
  defaultPassword: string;
}

export interface ApiSpecificationDownloadDynamicFixtures {
  rootUser: User;
}

export interface DynamicEntityConfigurationStaticFixtures {
  defaultPassword: string;
}

export interface DynamicEntityConfigurationDynamicFixtures {
  rootUser: User;
}
