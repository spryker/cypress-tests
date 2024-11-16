import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MpPage } from '@pages/mp';
import { MerchantRelationsRepository } from './merchant-relations-repository';

@injectable()
@autoWired
export class MerchantRelationsPage extends MpPage {
  @inject(MerchantRelationsRepository) private repository: MerchantRelationsRepository;

  protected PAGE_URL = '/merchant-relationship-merchant-portal-gui/merchant-relationship';

  find = (params: FindParams): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(params.query, { delay: 0 });
    cy.get(searchSelector).type('{enter}');

    this.interceptTable({
      url: '/merchant-relationship-merchant-portal-gui/merchant-relationship/table-data**',
      expectedCount: params.expectedCount,
    });

    return this.repository.getFirstTableRow();
  };

  getDrawer = (): Cypress.Chainable => {
    return this.repository.getDrawer();
  };
}

interface FindParams {
  query: string;
  expectedCount?: number;
}
