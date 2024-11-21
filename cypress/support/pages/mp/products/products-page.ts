import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MpPage } from '@pages/mp';
import { ProductsRepository } from './products-repository';

@injectable()
@autoWired
export class ProductsPage extends MpPage {
  @inject(ProductsRepository) private repository: ProductsRepository;

  protected PAGE_URL = '/product-merchant-portal-gui/products';

  find = (params: FindParams): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(params.query, { delay: 0 });
    cy.get(searchSelector).type('{enter}');

    this.interceptTable({
      url: '/product-merchant-portal-gui/products/table-data**',
      expectedCount: params.expectedCount,
    });

    return this.repository.getFirstTableRow();
  };

  getFirstTableRow = (): Cypress.Chainable => {
    return this.repository.getFirstTableRow();
  };

  getAddAttributeButton = (): Cypress.Chainable => {
    return this.repository.getAddAttributeButton();
  };

  clickAddAttributeButton = (): void => {
    cy.intercept('GET', '/product-merchant-portal-gui/update-product-abstract/table-data**').as('dataTable');
    cy.intercept('GET', '/product-merchant-portal-gui/update-product-abstract').as('createAttribute');

    cy.wait('@dataTable').then(() => {
      cy.get(this.repository.getAttributesTableSelector()).as('attributesTable');
      cy.get('@attributesTable').scrollIntoView();
      cy.get('@attributesTable')
        .should('be.visible')
        .then(() => {
          this.repository.getAddAttributeButton().click();
          cy.get('@createAttribute.all').should('have.length', 0);
        });
    });
  }

  getAttributesTableSelector = (): string => {
    return this.repository.getAttributesTableSelector();
  };

  getDrawer = (): Cypress.Chainable => {
    const drawer = this.repository.getDrawer();

    // Wait for the drawer to be visible
    this.interceptTable({
      url: '/product-merchant-portal-gui/products-concrete/table-data**',
      expectedCount: 1,
    });

    return drawer;
  };

  getSaveButtonSelector = (): string => {
    return this.repository.getSaveButtonSelector();
  };

  getTaxIdSetSelector = (): string => {
    return this.repository.getTaxIdSelector();
  };

  getTaxIdSetOptionSelector = (): string => {
    return this.repository.getTaxIdOptionSelector();
  };
}

interface FindParams {
  query: string;
  expectedCount?: number;
}
