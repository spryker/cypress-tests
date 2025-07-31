import { autoWired } from '@utils';
import { injectable } from 'inversify';

import { MerchantUserMultiFactorAuthPage } from '@pages/mp';

@injectable()
@autoWired
export class MerchantAgentMultiFactorAuthPage extends MerchantUserMultiFactorAuthPage {
  protected PAGE_URL = '/multi-factor-auth-merchant-portal/agent-user-management/set-up';
}
