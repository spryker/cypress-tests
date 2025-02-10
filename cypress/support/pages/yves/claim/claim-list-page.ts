import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { ClaimRepository } from './claim-repository';
import Chainable = Cypress.Chainable;

@injectable()
@autoWired
export class ClaimListPage extends YvesPage {
  @inject(REPOSITORIES.ClaimRepository) private repository: ClaimRepository;

  protected PAGE_URL = '/customer/claim';

  clickCreateClaimButton(): void {
    this.getCreateClaimButton().click();
  }

  getCreateClaimButton(): Chainable {
    return this.repository.getCreateGeneralClaimButton();
  }

  openLatestClaimDetailsPage(): void {
    this.repository.getFirstRowViewButton().click();
  }

  assetPageHasNoClaims(): void {
    this.repository.getClaimDetailLinks().should('not.exist');
  }

    getFirstRowReference(): Cypress.Chainable {
      return this.repository.getFirstRowReference();
    }
}
