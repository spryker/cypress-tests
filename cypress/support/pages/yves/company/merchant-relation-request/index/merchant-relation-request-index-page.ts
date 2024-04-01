import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { MerchantRelationRequestIndexRepository } from './merchant-relation-request-index-repository';

@injectable()
@autoWired
export class MerchantRelationRequestIndexPage extends YvesPage {
  @inject(REPOSITORIES.MerchantRelationRequestIndexRepository)
  private repository: MerchantRelationRequestIndexRepository;

  protected PAGE_URL = '/company/merchant-relation-request';

  create = (): void => {
    this.repository.getMerchantRelationRequestButton().click();
  };

  filterRequests = (params: FilterRequestsParams): void => {
    if (params.idMerchant) {
      this.repository.getFilterMerchantSelect().select(params.idMerchant.toString(), { force: true });
    }

    if (params.idBusinessUnitOwner) {
      this.repository.getFilterBusinessUnitOwnerSelect().select(params.idBusinessUnitOwner.toString(), { force: true });
    }

    if (params.status) {
      this.repository.getFilterStatusSelect().select(params.status, { force: true });
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

interface FilterRequestsParams {
  idMerchant?: number;
  idBusinessUnitOwner?: number;
  status?: string;
}
