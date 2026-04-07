import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductAttributeVisibilityEditRepository {
  getTableBodyRowsSelector = (): string => '.dataTable tbody tr';
  getSearchInputSelector = (): string => 'input[type="search"][data-qa="table-search"]';
  getVisibilityTypesSelect = (): Cypress.Chainable => cy.get('#attributeForm_visibility_types');
  getSubmitButton = (): Cypress.Chainable => cy.get('input[type="submit"].safe-submit');
}
