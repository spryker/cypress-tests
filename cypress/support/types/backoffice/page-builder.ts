import { User } from './shared';

export interface PageBuilderStaticFixtures {
  defaultPassword: string;
  templateName: string;
  storeName: string;
  localeName: string;
  otherLocaleName: string;
  slotName: string;
  cmsBlockName: string;
}

export interface PageBuilderDynamicFixtures {
  rootUser: User;
}
