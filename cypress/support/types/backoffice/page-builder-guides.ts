import { User } from './shared';

export interface PageBuilderGuidesStaticFixtures {
  defaultPassword: string;
  templateName: string;
  storeName: string;
  localeName: string;
  originalText: string;
  changedText: string;
}

export interface PageBuilderGuidesDynamicFixtures {
  rootUser: User;
}
