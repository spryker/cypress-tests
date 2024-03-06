import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { MpPage } from '../mp-page';
import { OffersRepository } from './offers-repository';

@injectable()
@autoWired
export class OffersPage extends MpPage {
  @inject(OffersRepository) private repository: OffersRepository;

  protected PAGE_URL = '/product-offer-merchant-portal-gui/product-offers';

  findOffer = (query: string): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(query);

    const interceptAlias = this.faker.string.uuid();
    cy.intercept('GET', '/product-offer-merchant-portal-gui/product-offers/table-data**').as(interceptAlias);
    cy.wait(`@${interceptAlias}`).its('response.body.total').should('eq', 1);

    return this.repository.getFirstTableRow();
  };

  getDrawer = (): Cypress.Chainable => {
    return this.repository.getDrawer();
  };
}
