import { User } from './shared';
export interface SspModelManagementStaticFixtures {
  defaultPassword: string;
  sspModel: {
    name: string;
    code: string;
    image?: string;
  };
  sspModelEdit: {
    code: string;
  };
}
export interface SspModelManagementDynamicFixtures {
  rootUser: User;
  sspModel: {
    id_ssp_model: number;
  };
}
