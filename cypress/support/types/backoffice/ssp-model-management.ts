import { User } from './shared';
export interface SspModelManagementStaticFixtures {
  defaultPassword: string;
  sspModel: {
    name: string;
    code: string;
  };
}
export interface SspModelManagementDynamicFixtures {
  rootUser: User;
}
