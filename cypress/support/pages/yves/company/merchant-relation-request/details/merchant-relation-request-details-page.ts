import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '../../../yves-page';
import { MerchantRelationRequestDetailsRepository } from './merchant-relation-request-details-repository';

@injectable()
@autoWired
export class MerchantRelationRequestDetailsPage extends YvesPage {
  @inject(REPOSITORIES.MerchantRelationRequestDetailsRepository)
  private repository: MerchantRelationRequestDetailsRepository;

  protected PAGE_URL = '/company/merchant-relation-request/details';

  getCancelButton = (): Cypress.Chainable => {
    return this.repository.getCancelButton();
  };
}
