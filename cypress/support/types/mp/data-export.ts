import { User } from './shared';

export interface MerchantProductExportDynamicFixtures {
  rootUser: User;
  merchantUser: User;
}

export interface MerchantProductExportStaticFixtures {
  defaultPassword: string;
}
