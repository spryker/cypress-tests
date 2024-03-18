import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '../../../yves-page';
import { MerchantRelationRequestIndexRepository } from './merchant-relation-request-index-repository';

@injectable()
@autoWired
export class MerchantRelationRequestIndexPage extends YvesPage {
  @inject(REPOSITORIES.MerchantRelationRequestIndexRepository)
  private repository: MerchantRelationRequestIndexRepository;

  protected PAGE_URL = '/company/merchant-relation-request';

  createMerchantRelationRequest = (): void => {
    this.repository.getMerchantRelationRequestButton().click();
  };
}
