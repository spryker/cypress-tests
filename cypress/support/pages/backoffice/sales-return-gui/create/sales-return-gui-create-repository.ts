import { autoWired } from '@utils';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
@autoWired
export class SalesReturnGuiCreateRepository {
  getAllItemsCheckbox = (): Cypress.Chainable => cy.get('.js-check-all-items');
  getCreateReturnButton = (): Cypress.Chainable =>
    cy.get('form[name=return_create_form]').find('button:contains("Create return")');
}
