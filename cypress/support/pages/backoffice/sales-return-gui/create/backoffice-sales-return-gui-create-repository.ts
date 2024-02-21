import { injectable } from 'inversify';
import 'reflect-metadata';
import { autoWired } from '../../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class BackofficeSalesReturnGuiCreateRepository {
  getAllItemsCheckbox = (): Cypress.Chainable => cy.get('.js-check-all-items');
  getCreateReturnButton = (): Cypress.Chainable =>
    cy.get('form[name=return_create_form]').find('button:contains("Create return")');
}
