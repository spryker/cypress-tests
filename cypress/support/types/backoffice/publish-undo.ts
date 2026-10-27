import { User } from './shared';

export interface PublishUndoStaticFixtures {
  defaultPassword: string;
  templateName: string;
  storeName: string;
  localeName: string;
  firstVersionText: string;
  secondVersionText: string;
}

export interface PublishUndoDynamicFixtures {
  rootUser: User;
}
