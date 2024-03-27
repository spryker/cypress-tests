import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { MerchantRepository } from './merchant-repository';

@injectable()
@autoWired
export class MerchantPage extends YvesPage {
  @inject(REPOSITORIES.MerchantRepository) private repository: MerchantRepository;

  protected PAGE_URL = '/merchant';

  sendMerchantRelationRequest = (): void => {
    this.repository.getMerchantRelationRequestButton().click();
  };
}
