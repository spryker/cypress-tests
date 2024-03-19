import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '../../../yves-page';
import { MerchantRelationRequestIndexRepository } from './merchant-relation-request-index-repository';

interface MerchantRelationRequestFilterParams {
  idMerchant?: number;
  idBusinessUnitOwner?: number;
  status?: string;
}

@injectable()
@autoWired
export class MerchantRelationRequestIndexPage extends YvesPage {
  @inject(REPOSITORIES.MerchantRelationRequestIndexRepository)
  private repository: MerchantRelationRequestIndexRepository;

  protected PAGE_URL = '/company/merchant-relation-request';

  createMerchantRelationRequest = (): void => {
    this.repository.getMerchantRelationRequestButton().click();
  };

  filterRequests = (params: MerchantRelationRequestFilterParams): void => {
    if (params.idMerchant) {
      this.repository.getFilterMerchantSelect().select(params.idMerchant.toString());
    }

    if (params.idBusinessUnitOwner) {
      this.repository.getFilterBusinessUnitOwnerSelect().select(params.idBusinessUnitOwner.toString());
    }

    if (params.status) {
      this.repository.getFilterStatusSelect().select(params.status);
    }

    this.repository.getApplyButton().click();
  };

  getFirstRequest = (): Cypress.Chainable => {
    return this.repository.getFirstTableRaw();
  };

  openFirstRequest = (): Cypress.Chainable => {
    return this.repository.getFirstTableRaw().find(this.repository.getViewLinkSelector()).click();
  };
}
