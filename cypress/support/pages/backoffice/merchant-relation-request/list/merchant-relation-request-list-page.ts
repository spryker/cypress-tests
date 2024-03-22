import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage, ActionEnum } from '@pages/backoffice';
import { MerchantRelationRequestListRepository } from './merchant-relation-request-list-repository';

@injectable()
@autoWired
export class MerchantRelationRequestListPage extends BackofficePage {
  @inject(MerchantRelationRequestListRepository) private repository: MerchantRelationRequestListRepository;

  protected PAGE_URL = '/merchant-relation-request-gui/list';

  update = (params: UpdateParams): void => {
    if (params.idMerchant) {
      this.repository.getFilterMerchantSelect().select(params.idMerchant.toString());
    }

    if (params.idCompany) {
      this.repository.getFilterCompanySelect().select(params.idCompany.toString());
    }

    switch (params.action) {
      case ActionEnum.view:
        this.repository.getViewButtons().first().click();
        break;
      case ActionEnum.edit:
        this.repository.getEditButtons().first().click();
        break;
      default:
        break;
    }
  };
}

interface UpdateParams {
  action: ActionEnum;
  idMerchant?: number;
  idCompany?: number;
}
