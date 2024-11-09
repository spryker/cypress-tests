import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MpPage } from '@pages/mp';
import { OffersRepository } from './offers-repository';

@injectable()
@autoWired
export class OffersPage extends MpPage {
  @inject(OffersRepository) private repository: OffersRepository;

  protected PAGE_URL = '/product-offer-merchant-portal-gui/product-offers';

  find = (params: FindParams): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).invoke('val', params.query);
    cy.get(searchSelector).type('{enter}');

    this.interceptTable({
      url: '/product-offer-merchant-portal-gui/product-offers/table-data**',
      expectedCount: params.expectedCount,
    });

    return this.repository.getFirstTableRow();
  };

  getDrawer = (): Cypress.Chainable => {
    return this.repository.getDrawer();
  };

  getSaveButtonSelector = (): string => {
    return this.repository.getSaveButtonSelector();
  };
}

interface FindParams {
  query: string;
  expectedCount?: number;
}
