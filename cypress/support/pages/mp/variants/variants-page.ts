import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MpPage } from '@pages/mp';
import { VariantsRepository } from './variants-repository';

@injectable()
@autoWired
export class VariantsPage extends MpPage {
  @inject(VariantsRepository) private repository: VariantsRepository;

  protected PAGE_URL = '/product-merchant-portal-gui/products-concrete';

  find = (params: FindParams): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).invoke('val', params.query);
    cy.get(searchSelector).type('{enter}');

    this.interceptTable({
      url: '/product-merchant-portal-gui/products-concrete/table-data**',
      expectedCount: params.expectedCount,
    });

    return this.repository.getFirstTableRow();
  };

  getProductConcretesCountSelector = (): Cypress.Chainable => {
    return this.repository.getProductConcretesCountSelector();
  };
}

interface FindParams {
  query: string;
  expectedCount?: number;
}
