import { autoWired } from '@utils';
import { injectable } from 'inversify';

import { MultiFactorAuthPage } from '@pages/yves';

@injectable()
@autoWired
export class AgentMultiFactorAuthPage extends MultiFactorAuthPage {
  protected PAGE_URL = '/agent/multi-factor-auth/set';
}
