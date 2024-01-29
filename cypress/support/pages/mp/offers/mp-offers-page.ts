import { AbstractPage } from '../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../utils/inversify/auto-provide';
import { MpOffersRepository } from './mp-offers-repository';

@injectable()
@autoProvide
export class MpOffersPage extends AbstractPage {
  public PAGE_URL: string = '/product-offer-merchant-portal-gui/product-offers';

  constructor(@inject(MpOffersRepository) private repository: MpOffersRepository) {
    super();
  }

  public findOffer = (query: string): Cypress.Chainable => {
    cy.get(this.repository.getSearchSelector()).clear().type(query);

    const interceptAlias = this.faker.string.uuid();
    cy.intercept('GET', '/product-offer-merchant-portal-gui/product-offers/table-data**').as(interceptAlias);
    cy.wait(`@${interceptAlias}`).its('response.body.total').should('eq', 1);

    return this.repository.getFirstTableRow();
  };

  public getDrawer = (): Cypress.Chainable => {
    return this.repository.getDrawer();
  };
}
