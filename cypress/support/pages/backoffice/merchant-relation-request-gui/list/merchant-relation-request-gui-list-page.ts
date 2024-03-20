import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '../../backoffice-page';
import { MerchantRelationRequestGuiListRepository } from './merchant-relation-request-gui-list-repository';

interface MerchantRelationRequestGuiListParams {
  idMerchant?: number;
  idCompany?: number;
}

@injectable()
@autoWired
export class MerchantRelationRequestGuiListPage extends BackofficePage {
  @inject(MerchantRelationRequestGuiListRepository) private repository: MerchantRelationRequestGuiListRepository;

  protected PAGE_URL = '/merchant-relation-request-gui/list';

  editLastRequest = (params: MerchantRelationRequestGuiListParams): void => {
    if (params.idMerchant) {
      this.repository.getFilterMerchantSelect().select(params.idMerchant.toString());
    }
    if (params.idCompany) {
      this.repository.getFilterCompanySelect().select(params.idCompany.toString());
    }

    this.repository.getEditButtons().first().click();
  };

  viewLastRequest = (params: MerchantRelationRequestGuiListParams): void => {
    if (params.idMerchant) {
      this.repository.getFilterMerchantSelect().select(params.idMerchant.toString());
    }
    if (params.idCompany) {
      this.repository.getFilterCompanySelect().select(params.idCompany.toString());
    }

    this.repository.getViewButtons().first().click();
  };
}
