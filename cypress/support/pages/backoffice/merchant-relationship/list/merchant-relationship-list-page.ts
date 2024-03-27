import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { MerchantRelationshipListRepository } from './merchant-relationship-list-repository';

@injectable()
@autoWired
export class MerchantRelationshipListPage extends BackofficePage {
  @inject(MerchantRelationshipListRepository) private repository: MerchantRelationshipListRepository;

  protected PAGE_URL = '/merchant-relationship-gui/list-merchant-relationship';

  applyFilters = (params: ApplyFiltersParams): void => {
    if (params.idCompany) {
      this.repository.getFilterCompanySelect().select(params.idCompany.toString());
    }

    if (params.query) {
      this.repository.getFilterSearchInput().type(params.query);
    }
  };

  getEditButtons = (): Cypress.Chainable => this.repository.getEditButtons();

  update = (params: UpdateParams): void => {
    this.applyFilters({ idCompany: params.idCompany, query: params.query });
    this.repository.getEditButtons().first().click();
  };
}

interface ApplyFiltersParams {
  idCompany?: number;
  query?: string;
}

interface UpdateParams {
  idCompany?: number;
  query?: string;
}
