import { User } from './shared';

export interface GlossaryManagementStaticFixtures {
  defaultPassword: string;
  glossaryKeyPrefix: string;
  translation: string;
  updatedTranslation: string;
}

export interface GlossaryManagementDynamicFixtures {
  rootUser: User;
}
