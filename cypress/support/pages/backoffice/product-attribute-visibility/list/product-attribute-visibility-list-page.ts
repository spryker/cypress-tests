import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { ProductAttributeVisibilityListRepository } from './product-attribute-visibility-list-repository';

@injectable()
@autoWired
export class ProductAttributeVisibilityListPage extends BackofficePage {
  @inject(ProductAttributeVisibilityListRepository) private repository: ProductAttributeVisibilityListRepository;

  protected PAGE_URL = '/product-attribute-gui/attribute';
  protected TABLE_AJAX_URL = '**/product-attribute-gui/attribute/table**';

  visitAndWaitForTable = (): void => {
    cy.intercept('GET', this.TABLE_AJAX_URL).as('tableLoad');
    this.visit();
    cy.wait('@tableLoad');
  };

  applyFilterAndSearch = (attributeKey: string, visibilityType: string): void => {
    this.visitAndWaitForTable();

    cy.get(this.repository.getVisibilityFilterContainerSelector()).click();
    cy.get(this.repository.getFilterDropdownOptionSelector()).contains(visibilityType).click();

    cy.intercept('GET', this.TABLE_AJAX_URL).as('tableFilterLoad');
    cy.get(this.repository.getFilterSubmitButtonSelector()).click();
    cy.wait('@tableFilterLoad');

    cy.intercept('GET', this.TABLE_AJAX_URL).as('tableSearchLoad');
    cy.get(this.repository.getSearchInputSelector()).clear();
    cy.get(this.repository.getSearchInputSelector()).type(attributeKey);
    cy.wait('@tableSearchLoad');
  };

  getTableHead = (): Cypress.Chainable => cy.get(this.repository.getTableHeadSelector());

  getVisibilityFilter = (): Cypress.Chainable => cy.get(this.repository.getVisibilityFilterSelector());

  getTableBodyRows = (): Cypress.Chainable => cy.get(this.repository.getTableBodyRowsSelector());

  getDisplayAtCell = (): Cypress.Chainable =>
    cy.get(this.repository.getTableBodyRowsSelector()).first().find('td').eq(this.repository.getDisplayAtColumnIndex());
}
