import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ProductsRepository } from './products-repository';
import { autoWired } from '../../../utils/inversify/auto-wired';
import { MpPage } from '../mp-page';

@injectable()
@autoWired
export class ProductsPage extends MpPage {
  protected PAGE_URL: string = '/product-merchant-portal-gui/products';

  constructor(@inject(ProductsRepository) private repository: ProductsRepository) {
    super();
  }

  public findProduct = (query: string): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(query);

    const interceptAlias = this.faker.string.uuid();
    cy.intercept('GET', '/product-merchant-portal-gui/products/table-data**').as(interceptAlias);
    cy.wait(`@${interceptAlias}`).its('response.body.total').should('eq', 1);

    return this.repository.getFirstTableRow();
  };

  public getDrawer = (): Cypress.Chainable => {
    const drawer = this.repository.getDrawer();

    // Wait for the drawer to be visible
    const interceptAlias = this.faker.string.uuid();
    cy.intercept('GET', '/product-merchant-portal-gui/products-concrete/table-data**').as(interceptAlias);
    cy.wait(`@${interceptAlias}`).its('response.body.total').should('eq', 1);

    return drawer;
  };
}
