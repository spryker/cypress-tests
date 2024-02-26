import { injectable } from 'inversify';
import 'reflect-metadata';
import { autoWired } from '../../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class UserIndexRepository {
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1)');
  getEditButtonSelector = (): string => 'a:contains("Edit")';
  getDeactivateButtonSelector = (): string => 'button:contains("Deactivate")';
  getDeleteButtonSelector = (): string => 'button:contains("Delete")';
  getActivateButtonSelector = (): string => 'button:contains("Activate")';
  getSearchSelector = (): string => '[type="search"]';
  getAddNewUserButton = (): Cypress.Chainable => cy.get('body').find('a:contains("Add New User")');
  getTableHeader = (): Cypress.Chainable => cy.get('.dataTables_scrollHead');
}
