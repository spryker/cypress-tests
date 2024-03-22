import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class SalesReturnCreateRepository {
  getAllItemsCheckbox = (): Cypress.Chainable => cy.get('.js-check-all-items');
  getCreateReturnButton = (): Cypress.Chainable =>
    cy.get('form[name=return_create_form]').find('button:contains("Create return")');
}
