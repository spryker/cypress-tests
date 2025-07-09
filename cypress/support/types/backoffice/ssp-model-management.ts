import { User } from './shared';
export interface SspModelManagementStaticFixtures {
  defaultPassword: string;
  sspModel: {
    name: string;
    code: string;
      image?: string;
  };
}
export interface SspModelManagementDynamicFixtures {
  rootUser: User;
}
