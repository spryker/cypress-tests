import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '../../backoffice-page';
import { MerchantRelationshipGuiListRepository } from './merchant-relationship-gui-list-repository';

interface MerchantRelationshipGuiListParams {
  idCompany?: number;
  query?: string;
}

@injectable()
@autoWired
export class MerchantRelationshipGuiListPage extends BackofficePage {
  @inject(MerchantRelationshipGuiListRepository) private repository: MerchantRelationshipGuiListRepository;

  protected PAGE_URL = '/merchant-relationship-gui/list-merchant-relationship';

  applyFilters = (params: MerchantRelationshipGuiListParams): void => {
    if (params.idCompany) {
      this.repository.getFilterCompanySelect().select(params.idCompany.toString());
    }
    if (params.query) {
      this.repository.getFilterSearchInput().type(params.query);
    }
  };

  getEditButtons = (): Cypress.Chainable => this.repository.getEditButtons();

  editLastRelation = (params: MerchantRelationshipGuiListParams): void => {
    this.applyFilters(params);
    this.repository.getEditButtons().first().click();
  };
}
