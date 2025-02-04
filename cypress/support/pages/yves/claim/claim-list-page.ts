import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import {ClaimRepository} from "./claim-repository";

@injectable()
@autoWired
export class ClaimListPage extends YvesPage {
  @inject(REPOSITORIES.ClaimRepository) private repository: ClaimRepository;

  protected PAGE_URL = '/customer/claim';

  clickCreateClaimButton(): void
  {
      this.repository.getCreateGeneralClaimButton().click();
  }
}


