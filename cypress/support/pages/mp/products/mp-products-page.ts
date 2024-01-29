import { AbstractPage } from '../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../utils/inversify/auto-provide';
import { MpProductsRepository } from './mp-products-repository';

@injectable()
@autoProvide
export class MpProductsPage extends AbstractPage {
  public PAGE_URL: string = '/product-merchant-portal-gui/products';

  constructor(@inject(MpProductsRepository) private repository: MpProductsRepository) {
    super();
  }

  public findProduct = (query: string): Cypress.Chainable => {
    cy.get(this.repository.getSearchSelector()).clear().type(query);

    const interceptAlias = this.faker.string.uuid();
    cy.intercept('GET', '/product-merchant-portal-gui/products/table-data**').as(interceptAlias);
    cy.wait(`@${interceptAlias}`).its('response.body.total').should('eq', 1);

    return this.repository.getFirstTableRow();
  };

  public getDrawer = (): Cypress.Chainable => {
    return this.repository.getDrawer();
  };
}
