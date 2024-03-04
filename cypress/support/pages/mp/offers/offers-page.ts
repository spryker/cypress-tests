import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { OffersRepository } from './offers-repository';
import { autoWired } from '../../../utils/inversify/auto-wired';
import { MpPage } from '../mp-page';

@injectable()
@autoWired
export class OffersPage extends MpPage {
  protected PAGE_URL: string = '/product-offer-merchant-portal-gui/product-offers';

  constructor(@inject(OffersRepository) private repository: OffersRepository) {
    super();
  }

  public findOffer = (query: string): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(query);

    const interceptAlias = this.faker.string.uuid();
    cy.intercept('GET', '/product-offer-merchant-portal-gui/product-offers/table-data**').as(interceptAlias);
    cy.wait(`@${interceptAlias}`).its('response.body.total').should('eq', 1);

    return this.repository.getFirstTableRow();
  };

  public getDrawer = (): Cypress.Chainable => {
    return this.repository.getDrawer();
  };
}
